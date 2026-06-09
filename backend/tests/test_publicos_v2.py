"""PublicOS v2 — tests for P0 (uploads + closure flow), P1 (officials + reset validate), P2 (AI classify + analytics)."""
import os
import io
import uuid
import base64
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://civictrack-3.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@publicos.in"
ADMIN_PASSWORD = "admin@1234"
CITIZEN_EMAIL = "citizen1@test.com"
CITIZEN_PWD = "test1234"
OFFICIAL_EMAIL = "official.ka@test.com"
OFFICIAL_PWD = "test1234"

UNIQ = uuid.uuid4().hex[:8]
NEW_CITIZEN = f"test_citz_{UNIQ}@example.com"
NEW_CITIZEN_PWD = "Citizen@1234"

PNG_BYTES = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
)

state = {}


# ---------- fixtures ----------
def _login(email, pwd):
    r = requests.post(f"{API}/auth/login", json={"email": email, "password": pwd})
    if r.status_code != 200:
        # try to register first citizen
        r2 = requests.post(f"{API}/auth/register", json={"email": email, "password": pwd, "name": email.split("@")[0]})
        if r2.status_code == 200:
            return r2.json()["token"]
        return None
    return r.json()["token"]


@pytest.fixture(scope="module")
def admin_token():
    t = _login(ADMIN_EMAIL, ADMIN_PASSWORD)
    assert t, "admin login failed"
    return t


@pytest.fixture(scope="module")
def citizen_token():
    t = _login(CITIZEN_EMAIL, CITIZEN_PWD)
    assert t, "citizen login failed"
    return t


@pytest.fixture(scope="module")
def official_token():
    t = _login(OFFICIAL_EMAIL, OFFICIAL_PWD)
    assert t, "official login failed"
    return t


def H(tok):
    return {"Authorization": f"Bearer {tok}"}


# ============ P0: Upload + file serve ============
def test_upload_png(citizen_token):
    files = {"file": ("test.png", PNG_BYTES, "image/png")}
    r = requests.post(f"{API}/upload", files=files, headers=H(citizen_token))
    assert r.status_code == 200, r.text
    body = r.json()
    assert "file_id" in body and "url" in body
    assert body["url"].startswith("/api/files/")
    assert body["content_type"] == "image/png"
    state["uploaded_url"] = body["url"]
    state["uploaded_file_id"] = body["file_id"]


def test_upload_rejects_non_image(citizen_token):
    files = {"file": ("hack.txt", b"not an image", "text/plain")}
    r = requests.post(f"{API}/upload", files=files, headers=H(citizen_token))
    assert r.status_code == 400


def test_upload_rejects_oversize(citizen_token):
    big = b"\x00" * (10 * 1024 * 1024 + 100)
    files = {"file": ("big.png", big, "image/png")}
    r = requests.post(f"{API}/upload", files=files, headers=H(citizen_token))
    assert r.status_code == 400


def test_upload_requires_auth():
    files = {"file": ("test.png", PNG_BYTES, "image/png")}
    r = requests.post(f"{API}/upload", files=files)
    assert r.status_code == 401


def test_serve_uploaded_file():
    fid = state.get("uploaded_file_id")
    assert fid
    r = requests.get(f"{API}/files/{fid}")
    assert r.status_code == 200
    assert r.headers.get("Content-Type", "").startswith("image/")
    assert len(r.content) > 0


def test_serve_missing_file_404():
    r = requests.get(f"{API}/files/doesnotexist123")
    assert r.status_code == 404


# ============ P0: Issue with photo URL ============
def test_create_issue_with_photo(citizen_token):
    photo = state.get("uploaded_url")
    body = {
        "title": "Streetlight not working near MG Road",
        "description": "The streetlight has been out for a week, very unsafe at night.",
        "category": "streetlight",
        "urgency": "high",
        "photos": [photo],
        "address": "MG Road",
        "city": "Bangalore",
        "district": "Bangalore Urban",
        "state": "Karnataka",
        "pincode": "560001",
    }
    r = requests.post(f"{API}/issues", json=body, headers=H(citizen_token))
    assert r.status_code == 200, r.text
    doc = r.json()
    assert photo in doc["photos"]
    state["issue_id"] = doc["issue_id"]


def test_admin_approve_issue(admin_token):
    iid = state["issue_id"]
    r = requests.post(f"{API}/admin/issues/{iid}/approve", headers=H(admin_token))
    assert r.status_code == 200


# ============ P0: Closure workflow ============
def test_closure_non_owner_forbidden(admin_token):
    iid = state["issue_id"]
    r = requests.post(
        f"{API}/issues/{iid}/request-closure",
        json={"comment": "Resolved", "proof_photos": []},
        headers=H(admin_token),
    )
    assert r.status_code == 403


def test_closure_owner_can_request(citizen_token):
    iid = state["issue_id"]
    r = requests.post(
        f"{API}/issues/{iid}/request-closure",
        json={"comment": "Light has been fixed, issue resolved.", "proof_photos": [state["uploaded_url"]]},
        headers=H(citizen_token),
    )
    assert r.status_code == 200
    g = requests.get(f"{API}/issues/{iid}")
    doc = g.json()
    assert doc["status"] == "closure_requested"
    assert doc["closure"]["requested_by_name"]
    assert len(doc["timeline"]) >= 2


def test_closure_decision_requires_official_or_admin(citizen_token):
    iid = state["issue_id"]
    r = requests.post(
        f"{API}/admin/issues/{iid}/closure-decision",
        json={"decision": "approve"},
        headers=H(citizen_token),
    )
    assert r.status_code == 403


def test_closure_reject_reopens(admin_token):
    iid = state["issue_id"]
    r = requests.post(
        f"{API}/admin/issues/{iid}/closure-decision",
        json={"decision": "reject", "remark": "needs evidence"},
        headers=H(admin_token),
    )
    assert r.status_code == 200, r.text
    body = r.json()
    # previous status was 'submitted' (no status change between approve and request-closure)
    assert body["status"] in ("submitted", "in_progress", "under_review", "assigned")


def test_closure_request_again_and_approve(citizen_token, admin_token):
    iid = state["issue_id"]
    r = requests.post(
        f"{API}/issues/{iid}/request-closure",
        json={"comment": "Re-requesting closure with photo proof.", "proof_photos": []},
        headers=H(citizen_token),
    )
    assert r.status_code == 200
    r2 = requests.post(
        f"{API}/admin/issues/{iid}/closure-decision",
        json={"decision": "approve"},
        headers=H(admin_token),
    )
    assert r2.status_code == 200
    doc = requests.get(f"{API}/issues/{iid}").json()
    assert doc["status"] == "closed"


# ============ P1: Official role ============
def test_official_me(official_token):
    r = requests.get(f"{API}/official/me", headers=H(official_token))
    assert r.status_code == 200
    body = r.json()
    assert body["role"] in ("official", "admin")
    assert "stats" in body
    assert "pending_closure" in body["stats"]
    # Jurisdiction should be Karnataka
    assert (body.get("jurisdiction") or {}).get("state", "").lower() == "karnataka"


def test_official_issues_scoped(official_token):
    r = requests.get(f"{API}/official/issues", headers=H(official_token))
    assert r.status_code == 200
    items = r.json()
    # All issues should be Karnataka
    for it in items:
        st = (it.get("location") or {}).get("state", "").lower()
        assert st == "karnataka", f"Got non-KA issue: {st}"


def test_official_status_rejects_closed(official_token):
    # Create a new KA issue via citizen and approve
    ct = _login(CITIZEN_EMAIL, CITIZEN_PWD)
    body = {
        "title": "Pothole near Brigade Road test", "description": "Big pothole, dangerous to two-wheelers.",
        "category": "pothole", "urgency": "high", "state": "Karnataka", "city": "Bangalore",
    }
    r = requests.post(f"{API}/issues", json=body, headers=H(ct))
    iid = r.json()["issue_id"]
    at = _login(ADMIN_EMAIL, ADMIN_PASSWORD)
    requests.post(f"{API}/admin/issues/{iid}/approve", headers=H(at))
    # Now official tries to set status=closed
    r2 = requests.post(
        f"{API}/official/issues/{iid}/status",
        json={"status": "closed"},
        headers=H(official_token),
    )
    assert r2.status_code == 400
    # And in_progress works
    r3 = requests.post(
        f"{API}/official/issues/{iid}/status",
        json={"status": "in_progress"},
        headers=H(official_token),
    )
    assert r3.status_code == 200
    state["ka_issue_id"] = iid


def test_official_outside_jurisdiction(official_token):
    # Create an issue in Maharashtra
    ct = _login(CITIZEN_EMAIL, CITIZEN_PWD)
    body = {
        "title": "Garbage piling up in Andheri area test", "description": "Garbage hasn't been collected for days.",
        "category": "garbage", "urgency": "medium", "state": "Maharashtra", "city": "Mumbai",
    }
    r = requests.post(f"{API}/issues", json=body, headers=H(ct))
    iid = r.json()["issue_id"]
    at = _login(ADMIN_EMAIL, ADMIN_PASSWORD)
    requests.post(f"{API}/admin/issues/{iid}/approve", headers=H(at))
    r2 = requests.post(
        f"{API}/official/issues/{iid}/status",
        json={"status": "in_progress"},
        headers=H(official_token),
    )
    assert r2.status_code == 403


def test_admin_promote_and_revoke_official(admin_token):
    # Create a temp citizen
    email = f"temp_off_{UNIQ}@example.com"
    pwd = "Temp@1234"
    r = requests.post(f"{API}/auth/register", json={"email": email, "password": pwd, "name": "Temp Off"})
    assert r.status_code == 200, r.text
    uid = r.json()["user_id"]
    # Promote
    r2 = requests.post(
        f"{API}/admin/officials/assign",
        json={"user_id": uid, "state": "Tamil Nadu", "district": ""},
        headers=H(admin_token),
    )
    assert r2.status_code == 200
    # Verify in list
    r3 = requests.get(f"{API}/admin/officials", headers=H(admin_token))
    assert any(u["user_id"] == uid for u in r3.json())
    # Revoke
    r4 = requests.post(
        f"{API}/admin/officials/revoke",
        json={"user_id": uid},
        headers=H(admin_token),
    )
    assert r4.status_code == 200


# ============ P1: Reset password token validation ============
def test_reset_validate_invalid_token():
    r = requests.post(f"{API}/auth/reset-password/validate", json={"token": "bogus-token-xyz"})
    assert r.status_code == 400
    body = r.json()
    assert "detail" in body


def test_reset_validate_valid_token():
    # Trigger forgot for citizen, then read token from DB via separate endpoint (no read endpoint, so we'll do round-trip differently)
    # Easier: register a brand-new user, request forgot, then use the token from logger? Not accessible.
    # We can at least confirm 400 path and that endpoint exists. Skip true positive.
    pytest.skip("valid-token positive test requires DB access; covered indirectly by reset-password flow")


# ============ P2: AI classify ============
def test_ai_classify_streetlight(citizen_token):
    r = requests.post(
        f"{API}/ai/classify",
        json={"title": "Streetlight not working", "description": "The streetlight at the corner is dead for a week"},
        headers=H(citizen_token),
    )
    assert r.status_code == 200, r.text
    body = r.json()
    # Could be None if LLM disabled, else must be from allowed list
    if body.get("category"):
        assert body["category"] in [
            "pothole", "garbage", "streetlight", "water", "drainage", "sewage",
            "electricity", "pollution", "encroachment", "traffic", "corruption", "noise", "other",
        ]
        # For obvious case, expect streetlight
        assert body["category"] == "streetlight", f"Expected streetlight, got {body['category']}"


def test_ai_classify_requires_auth():
    r = requests.post(f"{API}/ai/classify", json={"title": "x", "description": "y"})
    assert r.status_code == 401


# ============ P2: Analytics with closure_requested + closed ============
def test_admin_analytics_has_closure_fields(admin_token):
    r = requests.get(f"{API}/admin/analytics", headers=H(admin_token))
    assert r.status_code == 200
    body = r.json()
    assert "closure_requested" in body
    assert "closed" in body
    assert isinstance(body["closed"], int)
    assert isinstance(body["closure_requested"], int)
