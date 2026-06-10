import axios from "axios";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    signOut as fbSignOut,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// ---------------------------------------------------------------------------
// Direct Identity Toolkit REST helpers.
// We use these instead of the Firebase JS SDK for email/password flows because
// the SDK (v12) returns auth/network-request-failed in our preview environment
// even when Identity Toolkit returns a clean HTTP 400 — breaking error UX.
// Google Sign-In (popup) still uses the SDK below since the popup flow needs it.
// ---------------------------------------------------------------------------
const REST_BASE = "https://identitytoolkit.googleapis.com/v1/accounts";
const FB_KEY = process.env.REACT_APP_FIREBASE_API_KEY;

const restCall = async (endpoint, body) => {
    // Use axios (XHR transport) — global fetch interceptors (Firebase SDK telemetry,
    // Cloudflare RUM, etc.) consume the fetch Response body on error responses
    // BEFORE our handler runs, so we cannot read it via fetch in this environment.
    try {
        const { data } = await axios.post(
            `${REST_BASE}:${endpoint}?key=${FB_KEY}`,
            body,
            { headers: { "Content-Type": "application/json" } }
        );
        return data;
    } catch (e) {
        const resp = e?.response;
        const code = resp?.data?.error?.message || `HTTP_${resp?.status || "ERR"}`;
        const err = new Error(code);
        err.code = code;
        err.restError = true;
        throw err;
    }
};

export const restSignIn = (email, password) =>
    restCall("signInWithPassword", { email, password, returnSecureToken: true });

export const restSignUp = async (email, password, name) => {
    const data = await restCall("signUp", { email, password, returnSecureToken: true });
    if (name) {
        try {
            await restCall("update", { idToken: data.idToken, displayName: name, returnSecureToken: false });
        } catch (_) { /* non-fatal */ }
    }
    return data;
};

export {
    firebaseApp,
    auth,
    googleProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    fbSignOut,
};

// Friendly error message mapping.
// Handles both Firebase JS SDK codes (auth/...) and raw Identity Toolkit codes (INVALID_LOGIN_CREDENTIALS, ...).
export const formatFirebaseError = (err) => {
    const code = err?.code || "";
    const msg = `${err?.message || ""} ${err?.customData?.message || ""}`;

    // Direct map: Firebase SDK codes
    const sdkMap = {
        "auth/email-already-in-use": "An account with this email already exists. Try logging in.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password. Try again or reset it.",
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/invalid-login-credentials": "Incorrect email or password.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/popup-closed-by-user": "Sign-in was cancelled.",
        "auth/popup-blocked": "Popup was blocked by your browser. Please allow popups.",
        "auth/network-request-failed": "Network error. Check your connection.",
        "auth/user-disabled": "This account has been disabled.",
        "auth/operation-not-allowed": "This sign-in method is not enabled.",
    };
    if (sdkMap[code]) return sdkMap[code];

    // Direct map: Identity Toolkit raw error strings (used as code on REST errors)
    const restMap = {
        "INVALID_LOGIN_CREDENTIALS": "Incorrect email or password.",
        "EMAIL_NOT_FOUND": "No account found with this email.",
        "INVALID_PASSWORD": "Incorrect password. Try again or reset it.",
        "EMAIL_EXISTS": "An account with this email already exists. Try logging in.",
        "WEAK_PASSWORD : Password should be at least 6 characters": "Password must be at least 6 characters.",
        "WEAK_PASSWORD": "Password must be at least 6 characters.",
        "TOO_MANY_ATTEMPTS_TRY_LATER": "Too many attempts. Please try again later.",
        "USER_DISABLED": "This account has been disabled.",
        "INVALID_EMAIL": "Please enter a valid email address.",
        "MISSING_PASSWORD": "Please enter a password.",
        "OPERATION_NOT_ALLOWED": "This sign-in method is not enabled.",
    };
    if (restMap[code]) return restMap[code];

    // Substring fallback for prefixed codes like "WEAK_PASSWORD : ..."
    for (const key of Object.keys(restMap)) {
        if (code.startsWith(key) || msg.includes(key)) return restMap[key];
    }
    return err?.message || "Authentication failed.";
};
