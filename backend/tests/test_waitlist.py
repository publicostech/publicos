"""Backend tests for founding-citizen waitlist feature.

Covers:
- POST /api/waitlist happy + idempotency + validation
- GET /api/admin/waitlist admin-only access
- Startup unique index on db.waitlist.email
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # fall back to local supervised backend for in-container runs
    BASE_URL = "http://localhost:8001"
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@publicos.in"
ADMIN_PASSWORD = "admin@1234"
CITIZEN_EMAIL = "citizen1@test.com"
CITIZEN_PASSWORD = "test1234"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="module")
def citizen_token(session):
    r = session.post(f"{API}/auth/login", json={"email": CITIZEN_EMAIL, "password": CITIZEN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Citizen login failed: {r.status_code} {r.text}")
    return r.json()["token"]


# -------------------- POST /api/waitlist --------------------

class TestWaitlistJoin:
    def test_happy_path_new_signup(self, session):
        email = f"TEST_{uuid.uuid4().hex[:8]}@gmail.com"
        r = session.post(f"{API}/waitlist", json={"email": email, "city": "Pune", "source": "landing"})
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["ok"] is True
        assert data["already_joined"] is False
        assert isinstance(data["position"], int) and data["position"] > 0
        assert data["city"] == "Pune"

    def test_idempotent_same_email_updates_city(self, session):
        email = f"TEST_{uuid.uuid4().hex[:8]}@gmail.com"
        r1 = session.post(f"{API}/waitlist", json={"email": email, "city": "Pune"})
        assert r1.status_code == 200
        pos1 = r1.json()["position"]
        # resubmit with different city
        r2 = session.post(f"{API}/waitlist", json={"email": email, "city": "Mumbai"})
        assert r2.status_code == 200
        d2 = r2.json()
        assert d2["already_joined"] is True
        assert d2["position"] == pos1, "position should NOT change on idempotent resubmit"
        assert d2["city"] == "Mumbai", "city should be updated on resubmit"

    def test_invalid_email_returns_422(self, session):
        r = session.post(f"{API}/waitlist", json={"email": "not-an-email", "city": "Pune"})
        assert r.status_code == 422, r.text

    def test_short_city_returns_422(self, session):
        r = session.post(f"{API}/waitlist", json={"email": f"TEST_{uuid.uuid4().hex[:6]}@gmail.com", "city": "X"})
        assert r.status_code == 422, r.text

    def test_existing_seed_email_already_joined(self, session):
        # According to test context, founder@gmail.com is already in db with Bengaluru Urban
        r = session.post(f"{API}/waitlist", json={"email": "founder@gmail.com", "city": "Bengaluru Urban"})
        assert r.status_code == 200
        d = r.json()
        assert d["already_joined"] is True
        assert d["position"] >= 1


# -------------------- GET /api/admin/waitlist --------------------

class TestAdminWaitlist:
    def test_admin_can_list(self, session, admin_token):
        r = session.get(f"{API}/admin/waitlist", headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200, r.text
        data = r.json()
        assert "total" in data and isinstance(data["total"], int)
        assert "entries" in data and isinstance(data["entries"], list)
        assert "by_city" in data and isinstance(data["by_city"], list)
        assert data["total"] >= 1
        # entries must not leak mongo _id
        for e in data["entries"]:
            assert "_id" not in e
            assert "email" in e and "city" in e and "position" in e
        # by_city entries shape
        for c in data["by_city"]:
            assert "city" in c and "count" in c
            assert isinstance(c["count"], int)

    def test_citizen_gets_403(self, session, citizen_token):
        r = session.get(f"{API}/admin/waitlist", headers={"Authorization": f"Bearer {citizen_token}"})
        assert r.status_code == 403, f"expected 403, got {r.status_code} {r.text}"

    def test_unauthenticated_blocked(self, session):
        s2 = requests.Session()
        s2.headers.update({"Content-Type": "application/json"})
        r = s2.get(f"{API}/admin/waitlist")
        assert r.status_code in (401, 403), r.status_code


# -------------------- Unique index --------------------

class TestUniqueEmailIndex:
    def test_no_duplicate_insertion_error(self, session):
        """Hammer the same email — should always succeed via idempotent update, never raise."""
        email = f"TEST_{uuid.uuid4().hex[:8]}@gmail.com"
        results = []
        for i, city in enumerate(["Pune", "Mumbai", "Delhi", "Pune"]):
            r = session.post(f"{API}/waitlist", json={"email": email, "city": city})
            results.append((r.status_code, r.json() if r.status_code == 200 else r.text))
        codes = [r[0] for r in results]
        assert all(c == 200 for c in codes), f"some calls failed: {results}"
        # First call should be new; rest already_joined
        assert results[0][1]["already_joined"] is False
        for r in results[1:]:
            assert r[1]["already_joined"] is True
        # All return same position
        positions = {r[1]["position"] for r in results}
        assert len(positions) == 1, f"position changed across idempotent calls: {positions}"
