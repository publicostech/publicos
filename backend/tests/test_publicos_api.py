"""PublicOS backend regression tests — covers auth, issues, comments, admin moderation, analytics."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://civictrack-3.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@publicos.in"
ADMIN_PASSWORD = "admin@1234"

# Unique citizen for this test run
UNIQ = uuid.uuid4().hex[:8]
CITIZEN_EMAIL = f"test_citizen_{UNIQ}@example.com"
CITIZEN_PASSWORD = "Citizen@1234"
CITIZEN_NAME = "Test Citizen"

SECOND_EMAIL = f"test_citizen2_{UNIQ}@example.com"

state = {}


@pytest.fixture(scope="module")
def s():
    return requests.Session()


# ------------------- Health -------------------
def test_health_root(s):
    r = s.get(f"{API}/")
    assert r.status_code == 200
    assert r.json().get("name") == "PublicOS API"


# ------------------- Auth: register / login / me -------------------
def test_register_citizen(s):
    r = s.post(f"{API}/auth/register", json={
        "email": CITIZEN_EMAIL, "password": CITIZEN_PASSWORD, "name": CITIZEN_NAME,
    })
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["email"] == CITIZEN_EMAIL
    assert body["role"] == "citizen"
    assert isinstance(body["token"], str) and len(body["token"]) > 20
    state["citizen_token"] = body["token"]
    state["citizen_user_id"] = body["user_id"]


def test_register_duplicate_email(s):
    r = s.post(f"{API}/auth/register", json={
        "email": CITIZEN_EMAIL, "password": CITIZEN_PASSWORD, "name": CITIZEN_NAME,
    })
    assert r.status_code == 400


def test_admin_login(s):
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["email"] == ADMIN_EMAIL
    assert body["role"] == "admin"
    assert "token" in body
    state["admin_token"] = body["token"]


def test_login_invalid_credentials(s):
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
    assert r.status_code == 401


def test_me_authenticated():
    r = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {state['citizen_token']}"})
    assert r.status_code == 200
    body = r.json()
    assert body["email"] == CITIZEN_EMAIL
    assert "password_hash" not in body


def test_me_unauthenticated():
    r = requests.get(f"{API}/auth/me")
    assert r.status_code == 401


# ------------------- Forgot / reset password -------------------
def test_forgot_password_existing(s):
    r = s.post(f"{API}/auth/forgot-password", json={"email": CITIZEN_EMAIL})
    assert r.status_code == 200
    assert r.json().get("ok") is True


def test_forgot_password_nonexistent(s):
    # Should not enumerate — still 200
    r = s.post(f"{API}/auth/forgot-password", json={"email": f"nobody_{UNIQ}@example.com"})
    assert r.status_code == 200


def test_reset_password_invalid_token(s):
    r = s.post(f"{API}/auth/reset-password", json={"token": "garbage_token_xyz", "password": "newpass123"})
    assert r.status_code == 400


# ------------------- Issues: create (auth required) -------------------
def test_create_issue_requires_auth():
    # Use a fresh session — `s` would carry cookies from prior login
    r = requests.post(f"{API}/issues", json={
        "title": "Anonymous attempt to create issue",
        "description": "Should be rejected",
        "category": "roads",
    })
    assert r.status_code == 401


def test_create_issue_as_citizen():
    payload = {
        "title": "TEST_Pothole on Test Street near hospital",
        "description": "Large pothole causing traffic congestion. Testing seed.",
        "category": "roads",
        "urgency": "high",
        "anonymous": False,
        "address": "Test Street", "city": "Bengaluru", "state": "Karnataka", "pincode": "560001",
    }
    r = requests.post(f"{API}/issues", json=payload,
                      headers={"Authorization": f"Bearer {state['citizen_token']}"})
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["title"] == payload["title"]
    assert body["approval_status"] == "pending"
    assert body["status"] == "submitted"
    assert "issue_id" in body and body["issue_id"].startswith("PO-")
    state["new_issue_id"] = body["issue_id"]


# ------------------- Issues: public feed (approved only) -------------------
def test_list_issues_only_approved():
    r = requests.get(f"{API}/issues")
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list) and len(items) >= 10  # demo seed
    for it in items:
        assert it.get("approval_status") == "approved"
    # New pending issue must NOT appear
    ids = [it["issue_id"] for it in items]
    assert state["new_issue_id"] not in ids


def test_list_issues_filters():
    r = requests.get(f"{API}/issues", params={"category": "roads"})
    assert r.status_code == 200
    items = r.json()
    for it in items:
        assert it["category"] == "roads"

    r = requests.get(f"{API}/issues", params={"q": "pothole"})
    assert r.status_code == 200
    items = r.json()
    assert any("pothole" in it["title"].lower() or "pothole" in it["description"].lower() for it in items)

    r = requests.get(f"{API}/issues", params={"sort": "trending"})
    assert r.status_code == 200


def test_get_issue_detail_demo():
    r = requests.get(f"{API}/issues/PO-DEMO01")
    assert r.status_code == 200
    body = r.json()
    assert body["issue_id"] == "PO-DEMO01"
    assert "timeline" in body and isinstance(body["timeline"], list)


def test_get_issue_404():
    r = requests.get(f"{API}/issues/PO-NOPE99")
    assert r.status_code == 404


# ------------------- Upvote -------------------
def test_upvote_requires_auth():
    r = requests.post(f"{API}/issues/PO-DEMO01/upvote")
    assert r.status_code == 401


def test_upvote_toggle():
    h = {"Authorization": f"Bearer {state['citizen_token']}"}
    r1 = requests.post(f"{API}/issues/PO-DEMO01/upvote", headers=h)
    assert r1.status_code == 200, r1.text
    s1 = r1.json()
    assert "supported" in s1 and "upvotes" in s1
    # Toggle again
    r2 = requests.post(f"{API}/issues/PO-DEMO01/upvote", headers=h)
    assert r2.status_code == 200
    s2 = r2.json()
    assert s2["supported"] != s1["supported"]


# ------------------- Comments -------------------
def test_comment_requires_auth():
    r = requests.post(f"{API}/issues/PO-DEMO01/comments", json={"text": "hi"})
    assert r.status_code == 401


def test_comment_create_and_list():
    h = {"Authorization": f"Bearer {state['citizen_token']}"}
    text = f"TEST_comment_{UNIQ}"
    # Snapshot count
    r0 = requests.get(f"{API}/issues/PO-DEMO01")
    before = r0.json().get("comment_count", 0)
    r = requests.post(f"{API}/issues/PO-DEMO01/comments", json={"text": text}, headers=h)
    assert r.status_code == 200, r.text
    assert r.json()["text"] == text
    # comment_count incremented
    r2 = requests.get(f"{API}/issues/PO-DEMO01")
    assert r2.json()["comment_count"] == before + 1
    # listed
    r3 = requests.get(f"{API}/issues/PO-DEMO01/comments")
    assert r3.status_code == 200
    items = r3.json()
    assert items[0]["text"] == text  # newest first


# ------------------- My Issues -------------------
def test_me_issues():
    h = {"Authorization": f"Bearer {state['citizen_token']}"}
    r = requests.get(f"{API}/me/issues", headers=h)
    assert r.status_code == 200
    items = r.json()
    ids = [i["issue_id"] for i in items]
    assert state["new_issue_id"] in ids
    # All belong to this user
    for it in items:
        assert it["owner_user_id"] == state["citizen_user_id"]


# ------------------- Admin gating -------------------
def test_admin_endpoints_forbidden_for_citizen():
    h = {"Authorization": f"Bearer {state['citizen_token']}"}
    for path in ["/admin/issues", "/admin/users", "/admin/analytics"]:
        r = requests.get(f"{API}{path}", headers=h)
        assert r.status_code == 403, f"{path} returned {r.status_code}"


def test_admin_endpoints_require_auth():
    for path in ["/admin/issues", "/admin/users", "/admin/analytics"]:
        r = requests.get(f"{API}{path}")
        assert r.status_code == 401


# ------------------- Admin moderation -------------------
def test_admin_list_issues_includes_pending():
    h = {"Authorization": f"Bearer {state['admin_token']}"}
    r = requests.get(f"{API}/admin/issues", headers=h)
    assert r.status_code == 200
    items = r.json()
    ids = [i["issue_id"] for i in items]
    assert state["new_issue_id"] in ids


def test_admin_approve_makes_issue_public():
    h = {"Authorization": f"Bearer {state['admin_token']}"}
    r = requests.post(f"{API}/admin/issues/{state['new_issue_id']}/approve", headers=h)
    assert r.status_code == 200
    # Should now appear in public feed
    time.sleep(0.3)
    rf = requests.get(f"{API}/issues")
    ids = [i["issue_id"] for i in rf.json()]
    assert state["new_issue_id"] in ids
    # Detail shows approved status
    rd = requests.get(f"{API}/issues/{state['new_issue_id']}")
    assert rd.json()["approval_status"] == "approved"


def test_admin_reject_flow():
    # Create another pending issue and reject it
    h_c = {"Authorization": f"Bearer {state['citizen_token']}"}
    r = requests.post(f"{API}/issues", json={
        "title": "TEST_To be rejected by admin testcase",
        "description": "This issue should be rejected by admin.",
        "category": "garbage",
    }, headers=h_c)
    issue_id = r.json()["issue_id"]

    h_a = {"Authorization": f"Bearer {state['admin_token']}"}
    rr = requests.post(f"{API}/admin/issues/{issue_id}/reject", headers=h_a)
    assert rr.status_code == 200
    rd = requests.get(f"{API}/issues/{issue_id}")
    assert rd.json()["approval_status"] == "rejected"


def test_admin_users_no_password_hash():
    h = {"Authorization": f"Bearer {state['admin_token']}"}
    r = requests.get(f"{API}/admin/users", headers=h)
    assert r.status_code == 200
    users = r.json()
    assert isinstance(users, list) and len(users) >= 1
    for u in users:
        assert "password_hash" not in u


def test_admin_analytics():
    h = {"Authorization": f"Bearer {state['admin_token']}"}
    r = requests.get(f"{API}/admin/analytics", headers=h)
    assert r.status_code == 200
    a = r.json()
    for k in ("total_users", "total_issues", "by_category", "by_state",
             "pending_approval", "approved", "resolved", "in_progress"):
        assert k in a
    assert isinstance(a["by_category"], list)
    assert isinstance(a["by_state"], list)


# ------------------- Demo seed -------------------
def test_demo_issues_seeded():
    r = requests.get(f"{API}/issues")
    items = r.json()
    demo_ids = [i["issue_id"] for i in items if i["issue_id"].startswith("PO-DEMO")]
    assert len(demo_ids) >= 10
