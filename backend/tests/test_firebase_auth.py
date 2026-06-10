"""
Backend tests — Firebase Auth migration validation.
Covers /api/auth/firebase, /api/auth/me, /api/auth/logout, public health
(/api/, /api/issues, /api/waitlist) and admin moderation workflow.
"""

import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://civictrack-3.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

FIREBASE_API_KEY = "AIzaSyDRbIaOg5q1DgEMKSPoN-fMIq305orXbt4"
IDT_URL = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
SIGNUP_URL = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={FIREBASE_API_KEY}"

CREDS = {
    "admin": ("admin@publicos.in", "admin@1234"),
    "citizen": ("citizen1@test.com", "test1234"),
    "official": ("official.ka@test.com", "test1234"),
}


def firebase_signin(email, password):
    r = requests.post(IDT_URL, json={"email": email, "password": password, "returnSecureToken": True}, timeout=20)
    if r.status_code != 200:
        return None
    return r.json().get("idToken")


def exchange(id_token):
    return requests.post(f"{API}/auth/firebase", json={"id_token": id_token}, timeout=20)


# -------------------- Health / Public --------------------

class TestPublicEndpoints:
    def test_root(self):
        r = requests.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("name") == "PublicOS API"
        assert data.get("version") == "1.0"

    def test_issues_public(self):
        r = requests.get(f"{API}/issues", timeout=20)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 10, f"Expected >=10 seeded issues, got {len(items)}"
        # No mongo _id leak
        assert all("_id" not in it for it in items[:5])

    def test_waitlist_unauth(self):
        payload = {"email": f"TEST_wl_{int(time.time())}@example.com", "city": "Bengaluru"}
        r = requests.post(f"{API}/waitlist", json=payload, timeout=15)
        assert r.status_code in (200, 201), r.text


# -------------------- Firebase Auth Exchange --------------------

class TestFirebaseAuth:
    def test_invalid_token_rejected(self):
        r = exchange("invalid_garbage")
        assert r.status_code == 401
        assert "Invalid Firebase token" in r.text

    @pytest.mark.parametrize("role", ["admin", "citizen", "official"])
    def test_login_seeded_user(self, role):
        email, pw = CREDS[role]
        idt = firebase_signin(email, pw)
        assert idt, f"Firebase signin failed for {email}"
        r = exchange(idt)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == email
        assert data["role"] == role
        assert isinstance(data["token"], str) and len(data["token"]) > 20
        assert data.get("user_id", "").startswith("user_") or data.get("user_id")

    def test_auth_me_with_jwt(self):
        idt = firebase_signin(*CREDS["admin"])
        token = exchange(idt).json()["token"]
        r = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {token}"}, timeout=15)
        assert r.status_code == 200
        me = r.json()
        assert me["email"] == CREDS["admin"][0]
        assert me["role"] == "admin"

    def test_auth_me_without_token_401(self):
        r = requests.get(f"{API}/auth/me", timeout=15)
        assert r.status_code == 401

    def test_logout(self):
        idt = firebase_signin(*CREDS["citizen"])
        token = exchange(idt).json()["token"]
        s = requests.Session()
        r = s.post(f"{API}/auth/logout", headers={"Authorization": f"Bearer {token}"}, timeout=15)
        assert r.status_code == 200


# -------------------- New user registration end-to-end --------------------

class TestRegistration:
    def test_new_user_register_and_persist(self):
        email = f"test_qa_{int(time.time())}@publicos.test"
        password = "qa12345"
        # 1. Create via Firebase Identity Toolkit
        signup = requests.post(SIGNUP_URL, json={"email": email, "password": password, "returnSecureToken": True}, timeout=20)
        assert signup.status_code == 200, signup.text
        idt = signup.json()["idToken"]

        # 2. Exchange with backend (this mirrors what frontend does in Register.jsx)
        r = exchange(idt)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == email
        assert data["role"] == "citizen"
        token = data["token"]

        # 3. Verify Mongo persistence via /auth/me
        me = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {token}"}, timeout=15)
        assert me.status_code == 200
        assert me.json()["email"] == email


# -------------------- Citizen submit -> Admin moderation --------------------

class TestModerationFlow:
    def test_citizen_submit_then_admin_approve(self):
        # Citizen login
        idt = firebase_signin(*CREDS["citizen"])
        ctoken = exchange(idt).json()["token"]
        # Submit issue
        issue_payload = {
            "title": f"TEST_issue_{int(time.time())}",
            "description": "Pothole near MG Road causing traffic.",
            "category": "roads",
            "lat": 12.9716,
            "lng": 77.5946,
            "city": "Bengaluru",
            "state": "Karnataka",
            "address": "MG Road, Bengaluru",
        }
        r = requests.post(f"{API}/issues", json=issue_payload, headers={"Authorization": f"Bearer {ctoken}"}, timeout=20)
        assert r.status_code in (200, 201), f"submit failed: {r.status_code} {r.text}"
        issue = r.json()
        issue_id = issue.get("issue_id") or issue.get("id") or issue.get("_id")
        assert issue_id, f"missing issue id in {issue}"

        # Admin login
        a_idt = firebase_signin(*CREDS["admin"])
        atoken = exchange(a_idt).json()["token"]
        H = {"Authorization": f"Bearer {atoken}"}

        # Try to find moderation queue endpoint
        candidates = [
            f"{API}/admin/issues?status=pending",
            f"{API}/admin/moderation",
            f"{API}/admin/issues/pending",
            f"{API}/admin/issues",
        ]
        found = None
        for u in candidates:
            qr = requests.get(u, headers=H, timeout=15)
            if qr.status_code == 200:
                found = (u, qr.json())
                break
        assert found, "No admin moderation queue endpoint returned 200"

        # Attempt approve via likely patterns
        approve_urls = [
            (f"{API}/admin/issues/{issue_id}/approve", "post"),
            (f"{API}/issues/{issue_id}/approve", "post"),
            (f"{API}/admin/issues/{issue_id}", "patch"),
        ]
        approved = False
        for u, m in approve_urls:
            ar = requests.request(m, u, json={"status": "approved"}, headers=H, timeout=15)
            if ar.status_code in (200, 204):
                approved = True
                break
        assert approved, "Could not approve issue via known endpoints"
