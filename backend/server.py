from dotenv import load_dotenv
load_dotenv()

import os
import uuid
import asyncio
import logging
import secrets
import bcrypt
import jwt
import httpx
import requests
import resend
from datetime import datetime, timezone, timedelta
from typing import Optional, List
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File, Query
from fastapi.responses import Response as FastResponse
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("publicos")

# ------------------------------------------------------------------
# Constants & DB
# ------------------------------------------------------------------
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGO = "HS256"
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@publicos.in")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin@1234")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
APP_NAME = "publicos"
resend.api_key = RESEND_API_KEY

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="PublicOS API")
api = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------
# Storage helpers (Emergent object storage)
# ------------------------------------------------------------------
_storage_key: Optional[str] = None

def init_storage() -> Optional[str]:
    global _storage_key
    if _storage_key:
        return _storage_key
    if not EMERGENT_LLM_KEY:
        logger.warning("EMERGENT_LLM_KEY missing; storage disabled")
        return None
    try:
        r = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_LLM_KEY}, timeout=30)
        r.raise_for_status()
        _storage_key = r.json()["storage_key"]
        return _storage_key
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
        return None

def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    if not key:
        raise HTTPException(status_code=503, detail="Storage unavailable")
    r = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    if r.status_code == 403:
        # refresh key once
        globals()["_storage_key"] = None
        key = init_storage()
        if not key:
            raise HTTPException(status_code=503, detail="Storage unavailable")
        r = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            data=data,
            timeout=120,
        )
    r.raise_for_status()
    return r.json()

def get_object(path: str):
    key = init_storage()
    if not key:
        raise HTTPException(status_code=503, detail="Storage unavailable")
    r = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key},
        timeout=60,
    )
    if r.status_code == 403:
        globals()["_storage_key"] = None
        key = init_storage()
        if not key:
            raise HTTPException(status_code=503, detail="Storage unavailable")
        r = requests.get(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key},
            timeout=60,
        )
    r.raise_for_status()
    return r.content, r.headers.get("Content-Type", "application/octet-stream")

# ------------------------------------------------------------------
# Helpers — auth
# ------------------------------------------------------------------
def hash_password(pwd: str) -> str:
    return bcrypt.hashpw(pwd.encode(), bcrypt.gensalt()).decode()

def verify_password(pwd: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pwd.encode(), hashed.encode())
    except Exception:
        return False

def create_token(user_id: str, email: str, role: str, ttl_minutes: int = 60 * 24 * 7) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ttl_minutes),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

def set_auth_cookie(resp: Response, token: str):
    resp.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24 * 7,
        path="/",
    )

def clear_auth_cookie(resp: Response):
    resp.delete_cookie("access_token", path="/")

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.lower().startswith("bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"user_id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user

async def require_official_or_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") not in ("admin", "official"):
        raise HTTPException(status_code=403, detail="Official access only")
    return user

def issue_in_jurisdiction(issue: dict, user: dict) -> bool:
    """Admins always pass; officials must match state (and district if set)."""
    if user.get("role") == "admin":
        return True
    j = user.get("jurisdiction") or {}
    loc = issue.get("location") or {}
    if j.get("state") and (loc.get("state") or "").strip().lower() != j["state"].strip().lower():
        return False
    if j.get("district") and (loc.get("district") or "").strip().lower() != j["district"].strip().lower():
        return False
    return True

# ------------------------------------------------------------------
# Models
# ------------------------------------------------------------------
class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    name: str = Field(min_length=2, max_length=80)

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class ForgotIn(BaseModel):
    email: EmailStr

class ResetIn(BaseModel):
    token: str
    password: str = Field(min_length=6, max_length=128)

class GoogleCallbackIn(BaseModel):
    session_id: str

class IssueIn(BaseModel):
    title: str = Field(min_length=8, max_length=160)
    description: str = Field(min_length=10, max_length=4000)
    category: str
    urgency: str = "medium"
    anonymous: bool = False
    photos: List[str] = []
    address: str = ""
    city: str = ""
    district: str = ""
    state: str = ""
    pincode: str = ""
    lat: Optional[float] = None
    lng: Optional[float] = None

class CommentIn(BaseModel):
    text: str = Field(min_length=1, max_length=600)

class StatusIn(BaseModel):
    status: str
    remark: Optional[str] = ""

class ClosureRequestIn(BaseModel):
    comment: str = Field(min_length=4, max_length=1000)
    proof_photos: List[str] = []

class ClosureDecisionIn(BaseModel):
    decision: str  # "approve" or "reject"
    remark: Optional[str] = ""

class OfficialJurisdictionIn(BaseModel):
    user_id: str
    state: Optional[str] = ""
    district: Optional[str] = ""

class AIClassifyIn(BaseModel):
    title: str
    description: str = ""

class WaitlistIn(BaseModel):
    email: EmailStr
    city: str = Field(min_length=2, max_length=80)
    source: Optional[str] = "landing"

class ResetTokenIn(BaseModel):
    token: str

# ------------------------------------------------------------------
# Auth routes
# ------------------------------------------------------------------
@api.post("/auth/register")
async def register(body: RegisterIn, response: Response):
    email = body.email.lower().strip()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="An account with this email already exists. Try logging in.")
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    doc = {
        "user_id": user_id,
        "email": email,
        "name": body.name.strip(),
        "password_hash": hash_password(body.password),
        "role": "citizen",
        "picture": None,
        "auth_provider": "password",
        "reputation": 0,
        "created_at": datetime.now(timezone.utc),
    }
    await db.users.insert_one(doc)
    token = create_token(user_id, email, "citizen")
    set_auth_cookie(response, token)
    return {
        "user_id": user_id,
        "email": email,
        "name": body.name,
        "role": "citizen",
        "token": token,
    }

@api.post("/auth/login")
async def login(body: LoginIn, response: Response):
    email = body.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not user.get("password_hash"):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(user["user_id"], email, user.get("role", "citizen"))
    set_auth_cookie(response, token)
    return {
        "user_id": user["user_id"],
        "email": email,
        "name": user["name"],
        "role": user.get("role", "citizen"),
        "picture": user.get("picture"),
        "token": token,
    }

@api.post("/auth/logout")
async def logout(response: Response):
    clear_auth_cookie(response)
    return {"ok": True}

@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user

@api.post("/auth/google/callback")
async def google_callback(body: GoogleCallbackIn, response: Response):
    """Exchange Emergent session_id for user info; find or create user; issue our JWT."""
    try:
        async with httpx.AsyncClient(timeout=15) as hc:
            r = await hc.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": body.session_id},
            )
            r.raise_for_status()
            data = r.json()
    except Exception as e:
        logger.error(f"Google session exchange failed: {e}")
        raise HTTPException(status_code=400, detail="Could not verify Google session")

    email = data.get("email", "").lower().strip()
    if not email:
        raise HTTPException(status_code=400, detail="No email returned from Google")

    user = await db.users.find_one({"email": email})
    if not user:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        doc = {
            "user_id": user_id,
            "email": email,
            "name": data.get("name") or email.split("@")[0],
            "password_hash": None,
            "role": "citizen",
            "picture": data.get("picture"),
            "auth_provider": "google",
            "reputation": 0,
            "created_at": datetime.now(timezone.utc),
        }
        await db.users.insert_one(doc)
        user = doc
    else:
        # Attach google to existing user (1 email = 1 account)
        await db.users.update_one(
            {"user_id": user["user_id"]},
            {"$set": {"picture": data.get("picture") or user.get("picture"), "google_linked": True}},
        )

    token = create_token(user["user_id"], email, user.get("role", "citizen"))
    set_auth_cookie(response, token)
    return {
        "user_id": user["user_id"],
        "email": email,
        "name": user["name"],
        "role": user.get("role", "citizen"),
        "picture": user.get("picture"),
        "token": token,
    }

# ---------- Forgot / reset password ----------
async def send_reset_email(to_email: str, name: str, reset_url: str):
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#FAF9F6;border-radius:12px">
        <div style="font-size:22px;color:#0A192F;font-weight:700">PublicOS</div>
        <div style="font-size:11px;color:#64748b;letter-spacing:0.2em;text-transform:uppercase">Public Portal · India</div>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:18px 0"/>
        <h1 style="color:#0A192F;font-size:22px">Reset your PublicOS password</h1>
        <p style="color:#475569;line-height:1.6">Hi {name or 'Citizen'},</p>
        <p style="color:#475569;line-height:1.6">
            We received a request to reset your password. Click the button below to set a new one.
            This link is valid for 15 minutes. If you didn't request this, you can safely ignore the email.
        </p>
        <p style="margin:24px 0">
            <a href="{reset_url}" style="background:#0A192F;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block">
                Reset password
            </a>
        </p>
        <p style="color:#64748b;font-size:12px;line-height:1.5">
            Or copy this link into your browser:<br/>
            <span style="color:#0A192F;word-break:break-all">{reset_url}</span>
        </p>
        <p style="color:#94a3b8;font-size:11px;margin-top:32px">© 2026 PublicOS — A civic accountability initiative</p>
    </div>
    """
    try:
        await asyncio.to_thread(
            resend.Emails.send,
            {
                "from": f"PublicOS <{SENDER_EMAIL}>",
                "to": [to_email],
                "subject": "Reset your PublicOS password",
                "html": html,
            },
        )
    except Exception as e:
        logger.error(f"Resend send failed: {e}")

@api.post("/auth/forgot-password")
async def forgot_password(body: ForgotIn):
    email = body.email.lower().strip()
    user = await db.users.find_one({"email": email})
    # Always return ok to prevent email enumeration
    if user:
        token = secrets.token_urlsafe(32)
        await db.password_reset_tokens.insert_one({
            "token": token,
            "user_id": user["user_id"],
            "email": email,
            "expires_at": datetime.now(timezone.utc) + timedelta(minutes=15),
            "used": False,
            "created_at": datetime.now(timezone.utc),
        })
        reset_url = f"{FRONTEND_URL}/reset-password?token={token}"
        logger.info(f"Reset URL for {email}: {reset_url}")
        await send_reset_email(email, user.get("name", ""), reset_url)
    return {"ok": True, "message": "If an account exists for that email, a reset link has been sent."}

@api.post("/auth/reset-password")
async def reset_password(body: ResetIn):
    rec = await db.password_reset_tokens.find_one({"token": body.token, "used": False}, {"_id": 0})
    if not rec:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")
    expires_at = rec["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Reset link expired")
    await db.users.update_one(
        {"user_id": rec["user_id"]},
        {"$set": {"password_hash": hash_password(body.password), "auth_provider": "password"}},
    )
    await db.password_reset_tokens.update_one({"token": body.token}, {"$set": {"used": True}})
    return {"ok": True}

@api.post("/auth/reset-password/validate")
async def validate_reset_token(body: ResetTokenIn):
    rec = await db.password_reset_tokens.find_one({"token": body.token, "used": False}, {"_id": 0})
    if not rec:
        raise HTTPException(status_code=400, detail="Invalid or already-used reset link")
    expires_at = rec["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Reset link expired")
    return {"ok": True, "email": rec.get("email")}

# ------------------------------------------------------------------
# Uploads — Emergent object storage
# ------------------------------------------------------------------
MIME_EXT = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif"}
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB

@api.post("/upload")
async def upload_file(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    content_type = file.content_type or "application/octet-stream"
    if content_type not in MIME_EXT:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, WEBP, GIF images are allowed")
    data = await file.read()
    if len(data) == 0:
        raise HTTPException(status_code=400, detail="Empty file")
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="File exceeds 10 MB limit")
    ext = MIME_EXT[content_type]
    file_id = uuid.uuid4().hex
    path = f"{APP_NAME}/uploads/{user['user_id']}/{file_id}.{ext}"
    result = await asyncio.to_thread(put_object, path, data, content_type)
    rec = {
        "file_id": file_id,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "owner_user_id": user["user_id"],
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc),
    }
    await db.files.insert_one(rec)
    return {
        "file_id": file_id,
        "url": f"/api/files/{file_id}",
        "content_type": content_type,
        "size": rec["size"],
    }

@api.get("/files/{file_id}")
async def serve_file(file_id: str):
    rec = await db.files.find_one({"file_id": file_id, "is_deleted": False})
    if not rec:
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = await asyncio.to_thread(get_object, rec["storage_path"])
    return FastResponse(content=data, media_type=rec.get("content_type", content_type), headers={
        "Cache-Control": "public, max-age=86400",
    })

# ------------------------------------------------------------------
# AI — auto-classify category (P2)
# ------------------------------------------------------------------
CIVIC_CATEGORIES = [
    "pothole", "garbage", "streetlight", "water", "drainage", "sewage",
    "electricity", "pollution", "encroachment", "traffic", "corruption", "noise", "other"
]

@api.post("/ai/classify")
async def ai_classify(body: AIClassifyIn, user: dict = Depends(get_current_user)):
    """Use Emergent LLM key to suggest a category from issue title + description."""
    if not EMERGENT_LLM_KEY:
        return {"category": None, "confidence": 0, "reason": "LLM disabled"}
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"classify-{uuid.uuid4().hex[:8]}",
            system_message=(
                "You are a civic issue classifier for an Indian public reporting platform. "
                f"Read the citizen report and return ONLY one category from this list, lower-case: {', '.join(CIVIC_CATEGORIES)}. "
                "Do not output anything else."
            ),
        ).with_model("openai", "gpt-4o-mini")
        msg = UserMessage(text=f"Title: {body.title}\nDescription: {body.description}\n\nCategory:")
        out = await chat.send_message(msg)
        guess = (out or "").strip().lower().split()[0].strip(".,:'\"")
        if guess not in CIVIC_CATEGORIES:
            guess = "other"
        return {"category": guess}
    except Exception as e:
        logger.error(f"AI classify failed: {e}")
        return {"category": None, "error": str(e)}

# ------------------------------------------------------------------
# Founding-citizen waitlist
# ------------------------------------------------------------------
@api.post("/waitlist")
async def join_waitlist(body: WaitlistIn):
    email = body.email.lower().strip()
    city = body.city.strip()
    now = datetime.now(timezone.utc)
    existing = await db.waitlist.find_one({"email": email})
    if existing:
        # Idempotent: update city if changed, keep first-joined timestamp
        await db.waitlist.update_one(
            {"email": email},
            {"$set": {"city": city, "last_seen_at": now}},
        )
        position = existing.get("position", 0)
        return {"ok": True, "already_joined": True, "position": position, "city": city}
    position = (await db.waitlist.count_documents({})) + 1
    await db.waitlist.insert_one({
        "email": email,
        "city": city,
        "source": body.source or "landing",
        "joined_at": now,
        "last_seen_at": now,
        "position": position,
    })
    return {"ok": True, "already_joined": False, "position": position, "city": city}

@api.get("/admin/waitlist")
async def admin_waitlist(_a: dict = Depends(require_admin)):
    cursor = db.waitlist.find({}, {"_id": 0}).sort("joined_at", -1).limit(1000)
    entries = [doc async for doc in cursor]
    total = await db.waitlist.count_documents({})
    # by_city aggregation (top 20)
    pipe = [{"$group": {"_id": "$city", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}, {"$limit": 20}]
    by_city = [{"city": d["_id"], "count": d["count"]} async for d in db.waitlist.aggregate(pipe)]
    return {"total": total, "entries": entries, "by_city": by_city}

# ------------------------------------------------------------------
# Issues
# ------------------------------------------------------------------
def issue_card(doc: dict) -> dict:
    return {k: v for k, v in doc.items() if k != "_id"}

@api.post("/issues")
async def create_issue(body: IssueIn, user: dict = Depends(get_current_user)):
    issue_id = f"PO-{uuid.uuid4().hex[:6].upper()}"
    now = datetime.now(timezone.utc)
    doc = {
        "issue_id": issue_id,
        "title": body.title,
        "description": body.description,
        "category": body.category,
        "urgency": body.urgency,
        "status": "submitted",
        "approval_status": "pending",  # admin must approve before public
        "anonymous": body.anonymous,
        "photos": body.photos,
        "location": {
            "address": body.address,
            "city": body.city,
            "district": body.district,
            "state": body.state,
            "pincode": body.pincode,
            "lat": body.lat,
            "lng": body.lng,
        },
        "reporter": {
            "user_id": user["user_id"],
            "name": user["name"] if not body.anonymous else "Anonymous",
            "anonymous": body.anonymous,
            "picture": user.get("picture") if not body.anonymous else None,
        },
        "owner_user_id": user["user_id"],
        "upvotes": 0,
        "upvoted_by": [],
        "comment_count": 0,
        "posted_at": now,
        "timeline": [
            {"at": now, "label": "Submitted by citizen", "actor": user["name"]},
        ],
    }
    await db.issues.insert_one(doc)
    return issue_card(doc)

@api.get("/issues")
async def list_issues(
    category: Optional[str] = None,
    status: Optional[str] = None,
    state: Optional[str] = None,
    urgency: Optional[str] = None,
    q: Optional[str] = None,
    sort: str = "latest",
    limit: int = 60,
):
    query: dict = {"approval_status": "approved"}
    if category and category != "all":
        query["category"] = category
    if status and status != "all":
        query["status"] = status
    if state and state != "all":
        query["location.state"] = state
    if urgency and urgency != "all":
        query["urgency"] = urgency
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"location.city": {"$regex": q, "$options": "i"}},
            {"location.pincode": q},
        ]
    sort_key = ("posted_at", -1)
    if sort == "trending":
        sort_key = ("upvotes", -1)
    elif sort == "resolved":
        query["status"] = "resolved"
    elif sort == "critical":
        query["urgency"] = "critical"

    cursor = db.issues.find(query, {"_id": 0}).sort([sort_key]).limit(limit)
    return [doc async for doc in cursor]

@api.get("/issues/{issue_id}")
async def get_issue(issue_id: str):
    doc = await db.issues.find_one({"issue_id": issue_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Issue not found")
    return doc

@api.post("/issues/{issue_id}/upvote")
async def toggle_upvote(issue_id: str, user: dict = Depends(get_current_user)):
    doc = await db.issues.find_one({"issue_id": issue_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Issue not found")
    if user["user_id"] in doc.get("upvoted_by", []):
        await db.issues.update_one(
            {"issue_id": issue_id},
            {"$pull": {"upvoted_by": user["user_id"]}, "$inc": {"upvotes": -1}},
        )
        return {"supported": False, "upvotes": doc["upvotes"] - 1}
    await db.issues.update_one(
        {"issue_id": issue_id},
        {"$addToSet": {"upvoted_by": user["user_id"]}, "$inc": {"upvotes": 1}},
    )
    return {"supported": True, "upvotes": doc["upvotes"] + 1}

@api.post("/issues/{issue_id}/comments")
async def add_comment(issue_id: str, body: CommentIn, user: dict = Depends(get_current_user)):
    if not await db.issues.find_one({"issue_id": issue_id}):
        raise HTTPException(status_code=404, detail="Issue not found")
    comment = {
        "comment_id": f"c_{uuid.uuid4().hex[:10]}",
        "issue_id": issue_id,
        "user_id": user["user_id"],
        "user_name": user["name"],
        "user_picture": user.get("picture"),
        "is_official": user.get("role") in ("admin", "official"),
        "text": body.text.strip(),
        "at": datetime.now(timezone.utc),
        "upvotes": 0,
    }
    await db.comments.insert_one(comment)
    await db.issues.update_one({"issue_id": issue_id}, {"$inc": {"comment_count": 1}})
    return {k: v for k, v in comment.items() if k != "_id"}

@api.get("/issues/{issue_id}/comments")
async def list_comments(issue_id: str):
    cursor = db.comments.find({"issue_id": issue_id}, {"_id": 0}).sort("at", -1)
    return [c async for c in cursor]

@api.get("/me/issues")
async def my_issues(user: dict = Depends(get_current_user)):
    cursor = db.issues.find({"owner_user_id": user["user_id"]}, {"_id": 0}).sort("posted_at", -1)
    return [doc async for doc in cursor]

# ------------------------------------------------------------------
# Closure workflow — citizen requests, admin/official decides
# ------------------------------------------------------------------
@api.post("/issues/{issue_id}/request-closure")
async def request_closure(issue_id: str, body: ClosureRequestIn, user: dict = Depends(get_current_user)):
    doc = await db.issues.find_one({"issue_id": issue_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Issue not found")
    if doc.get("owner_user_id") != user["user_id"]:
        raise HTTPException(status_code=403, detail="Only the reporter can request closure")
    if doc.get("status") == "closed":
        raise HTTPException(status_code=400, detail="Issue is already closed")
    if doc.get("status") == "closure_requested":
        raise HTTPException(status_code=400, detail="Closure already requested")
    now = datetime.now(timezone.utc)
    closure = {
        "requested_by": user["user_id"],
        "requested_by_name": user["name"],
        "comment": body.comment.strip(),
        "proof_photos": body.proof_photos,
        "requested_at": now,
        "decision": "pending",
    }
    await db.issues.update_one(
        {"issue_id": issue_id},
        {
            "$set": {
                "previous_status": doc.get("status", "submitted"),
                "status": "closure_requested",
                "closure": closure,
            },
            "$push": {
                "timeline": {
                    "at": now,
                    "label": "Citizen requested closure",
                    "actor": user["name"],
                    "note": body.comment.strip(),
                }
            },
        },
    )
    return {"ok": True, "status": "closure_requested"}

@api.post("/admin/issues/{issue_id}/closure-decision")
async def closure_decision(issue_id: str, body: ClosureDecisionIn, actor: dict = Depends(require_official_or_admin)):
    doc = await db.issues.find_one({"issue_id": issue_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Issue not found")
    if doc.get("status") != "closure_requested":
        raise HTTPException(status_code=400, detail="No pending closure request for this issue")
    if not issue_in_jurisdiction(doc, actor):
        raise HTTPException(status_code=403, detail="Outside your jurisdiction")
    now = datetime.now(timezone.utc)
    if body.decision == "approve":
        await db.issues.update_one(
            {"issue_id": issue_id},
            {
                "$set": {
                    "status": "closed",
                    "closed_at": now,
                    "closed_by": actor["user_id"],
                    "closure.decision": "approved",
                    "closure.decided_at": now,
                    "closure.decided_by": actor["user_id"],
                    "closure.decision_remark": body.remark or "",
                },
                "$push": {
                    "timeline": {
                        "at": now,
                        "label": "Closure approved — issue permanently closed",
                        "actor": actor.get("name", "Official"),
                        "note": body.remark or "",
                    }
                },
            },
        )
        return {"ok": True, "status": "closed"}
    elif body.decision == "reject":
        prev = doc.get("previous_status") or "in_progress"
        await db.issues.update_one(
            {"issue_id": issue_id},
            {
                "$set": {
                    "status": prev,
                    "closure.decision": "rejected",
                    "closure.decided_at": now,
                    "closure.decided_by": actor["user_id"],
                    "closure.decision_remark": body.remark or "",
                },
                "$push": {
                    "timeline": {
                        "at": now,
                        "label": "Closure request rejected — issue reopened",
                        "actor": actor.get("name", "Official"),
                        "note": body.remark or "",
                    }
                },
            },
        )
        return {"ok": True, "status": prev}
    raise HTTPException(status_code=400, detail="decision must be 'approve' or 'reject'")

# ------------------------------------------------------------------
# Admin
# ------------------------------------------------------------------
@api.get("/admin/issues")
async def admin_issues(
    approval: Optional[str] = None,
    _user: dict = Depends(require_admin),
):
    query: dict = {}
    if approval:
        query["approval_status"] = approval
    cursor = db.issues.find(query, {"_id": 0}).sort("posted_at", -1)
    return [doc async for doc in cursor]

@api.post("/admin/issues/{issue_id}/approve")
async def admin_approve(issue_id: str, admin: dict = Depends(require_admin)):
    res = await db.issues.update_one(
        {"issue_id": issue_id},
        {
            "$set": {"approval_status": "approved", "approved_at": datetime.now(timezone.utc), "approved_by": admin["user_id"]},
            "$push": {"timeline": {"at": datetime.now(timezone.utc), "label": "Approved & made public", "actor": "Admin"}},
        },
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Issue not found")
    return {"ok": True}

@api.post("/admin/issues/{issue_id}/reject")
async def admin_reject(issue_id: str, admin: dict = Depends(require_admin)):
    res = await db.issues.update_one(
        {"issue_id": issue_id},
        {
            "$set": {"approval_status": "rejected", "rejected_at": datetime.now(timezone.utc), "rejected_by": admin["user_id"]},
            "$push": {"timeline": {"at": datetime.now(timezone.utc), "label": "Rejected by admin", "actor": "Admin"}},
        },
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Issue not found")
    return {"ok": True}

@api.post("/admin/issues/{issue_id}/status")
async def admin_status(issue_id: str, body: StatusIn, admin: dict = Depends(require_admin)):
    res = await db.issues.update_one(
        {"issue_id": issue_id},
        {
            "$set": {"status": body.status},
            "$push": {
                "timeline": {
                    "at": datetime.now(timezone.utc),
                    "label": f"Status → {body.status.replace('_', ' ')}" + (f" · {body.remark}" if body.remark else ""),
                    "actor": "Admin",
                }
            },
        },
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Issue not found")
    return {"ok": True}

# ------------------------------------------------------------------
# Official role management
# ------------------------------------------------------------------
@api.post("/admin/officials/assign")
async def assign_official(body: OfficialJurisdictionIn, _a: dict = Depends(require_admin)):
    user = await db.users.find_one({"user_id": body.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.get("role") == "admin":
        raise HTTPException(status_code=400, detail="Cannot demote admin")
    await db.users.update_one(
        {"user_id": body.user_id},
        {"$set": {
            "role": "official",
            "jurisdiction": {"state": (body.state or "").strip(), "district": (body.district or "").strip()},
        }},
    )
    return {"ok": True}

@api.post("/admin/officials/revoke")
async def revoke_official(body: OfficialJurisdictionIn, _a: dict = Depends(require_admin)):
    await db.users.update_one(
        {"user_id": body.user_id, "role": "official"},
        {"$set": {"role": "citizen"}, "$unset": {"jurisdiction": ""}},
    )
    return {"ok": True}

@api.get("/admin/officials")
async def list_officials(_a: dict = Depends(require_admin)):
    cursor = db.users.find({"role": "official"}, {"_id": 0, "password_hash": 0}).sort("created_at", -1)
    return [u async for u in cursor]

# ------------------------------------------------------------------
# Official panel APIs (jurisdiction-scoped)
# ------------------------------------------------------------------
def _jurisdiction_query(user: dict) -> dict:
    q: dict = {}
    if user.get("role") == "official":
        j = user.get("jurisdiction") or {}
        if j.get("state"):
            q["location.state"] = j["state"]
        if j.get("district"):
            q["location.district"] = j["district"]
    return q

@api.get("/official/issues")
async def official_issues(actor: dict = Depends(require_official_or_admin)):
    q = _jurisdiction_query(actor)
    # Officials see approved + closure_requested + active issues; not pending moderation
    q["approval_status"] = "approved"
    cursor = db.issues.find(q, {"_id": 0}).sort("posted_at", -1).limit(500)
    return [doc async for doc in cursor]

@api.get("/official/me")
async def official_me(actor: dict = Depends(require_official_or_admin)):
    pending_closure = await db.issues.count_documents({
        "status": "closure_requested",
        **_jurisdiction_query(actor),
        "approval_status": "approved",
    })
    open_issues = await db.issues.count_documents({
        "status": {"$in": ["submitted", "under_review", "assigned", "in_progress"]},
        **_jurisdiction_query(actor),
        "approval_status": "approved",
    })
    resolved = await db.issues.count_documents({
        "status": {"$in": ["resolved", "closed"]},
        **_jurisdiction_query(actor),
        "approval_status": "approved",
    })
    return {
        "role": actor.get("role"),
        "jurisdiction": actor.get("jurisdiction") or {},
        "name": actor.get("name"),
        "stats": {"pending_closure": pending_closure, "open": open_issues, "resolved": resolved},
    }

@api.post("/official/issues/{issue_id}/status")
async def official_status(issue_id: str, body: StatusIn, actor: dict = Depends(require_official_or_admin)):
    doc = await db.issues.find_one({"issue_id": issue_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Issue not found")
    if not issue_in_jurisdiction(doc, actor):
        raise HTTPException(status_code=403, detail="Outside your jurisdiction")
    if body.status == "closed":
        raise HTTPException(status_code=400, detail="Use the closure-decision endpoint to close issues")
    await db.issues.update_one(
        {"issue_id": issue_id},
        {
            "$set": {"status": body.status},
            "$push": {
                "timeline": {
                    "at": datetime.now(timezone.utc),
                    "label": f"Status → {body.status.replace('_', ' ')}" + (f" · {body.remark}" if body.remark else ""),
                    "actor": actor.get("name", "Official"),
                }
            },
        },
    )
    return {"ok": True}

@api.get("/admin/users")
async def admin_users(_a: dict = Depends(require_admin)):
    cursor = db.users.find({}, {"_id": 0, "password_hash": 0}).sort("created_at", -1).limit(500)
    return [u async for u in cursor]

@api.get("/admin/analytics")
async def admin_analytics(_a: dict = Depends(require_admin)):
    total_users = await db.users.count_documents({})
    total_issues = await db.issues.count_documents({})
    pending = await db.issues.count_documents({"approval_status": "pending"})
    approved = await db.issues.count_documents({"approval_status": "approved"})
    resolved = await db.issues.count_documents({"status": "resolved"})
    closed = await db.issues.count_documents({"status": "closed"})
    closure_requested = await db.issues.count_documents({"status": "closure_requested"})
    in_progress = await db.issues.count_documents({"status": "in_progress"})
    by_cat_cur = db.issues.aggregate([
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ])
    by_state_cur = db.issues.aggregate([
        {"$group": {"_id": "$location.state", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 12},
    ])
    by_category = [{"category": d["_id"] or "unknown", "count": d["count"]} async for d in by_cat_cur]
    by_state = [{"state": d["_id"] or "unknown", "count": d["count"]} async for d in by_state_cur]
    return {
        "total_users": total_users,
        "total_issues": total_issues,
        "pending_approval": pending,
        "approved": approved,
        "resolved": resolved,
        "closed": closed,
        "closure_requested": closure_requested,
        "in_progress": in_progress,
        "by_category": by_category,
        "by_state": by_state,
    }

# ------------------------------------------------------------------
# Seed
# ------------------------------------------------------------------
async def seed_admin():
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if not existing:
        await db.users.insert_one({
            "user_id": f"user_admin_{uuid.uuid4().hex[:8]}",
            "email": ADMIN_EMAIL,
            "name": "PublicOS Admin",
            "password_hash": hash_password(ADMIN_PASSWORD),
            "role": "admin",
            "picture": None,
            "auth_provider": "password",
            "reputation": 999,
            "created_at": datetime.now(timezone.utc),
        })
        logger.info(f"Admin seeded: {ADMIN_EMAIL}")
    else:
        # Ensure password matches env (idempotent)
        if not existing.get("password_hash") or not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
            await db.users.update_one(
                {"email": ADMIN_EMAIL},
                {"$set": {"password_hash": hash_password(ADMIN_PASSWORD), "role": "admin"}},
            )
            logger.info("Admin password refreshed")

async def seed_demo_issues():
    """Seed approved demo issues so the public feed has content even when fresh."""
    if await db.issues.count_documents({"is_demo": True}) > 0:
        return
    from demo_seed import DEMO_ISSUES
    docs = []
    for d in DEMO_ISSUES:
        d["is_demo"] = True
        d["approval_status"] = "approved"
        d["upvoted_by"] = []
        d["comment_count"] = 0
        d["timeline"] = [{"at": d["posted_at"], "label": "Submitted by citizen", "actor": d["reporter"]["name"]}]
        docs.append(d)
    if docs:
        await db.issues.insert_many(docs)
        logger.info(f"Seeded {len(docs)} demo issues")

@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("user_id", unique=True)
    await db.issues.create_index("issue_id", unique=True)
    await db.issues.create_index("approval_status")
    await db.issues.create_index("category")
    await db.issues.create_index("status")
    await db.password_reset_tokens.create_index("expires_at", expireAfterSeconds=3600)
    await db.password_reset_tokens.create_index("token", unique=True)
    await db.comments.create_index("issue_id")
    await db.files.create_index("file_id", unique=True)
    await db.waitlist.create_index("email", unique=True)
    await db.waitlist.create_index("joined_at")
    try:
        await asyncio.to_thread(init_storage)
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed at startup: {e}")
    await seed_admin()
    await seed_demo_issues()

@api.get("/")
async def root():
    return {"name": "PublicOS API", "version": "1.0"}

app.include_router(api)
