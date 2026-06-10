import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "./api";
import {
    auth,
    googleProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
    fbSignOut,
} from "./firebase";

const AuthContext = createContext({
    user: null,
    loading: true,
    login: async () => {},
    register: async () => {},
    googleLogin: async () => {},
    forgotPassword: async () => {},
    logout: async () => {},
    refreshMe: async () => {},
});

// Exchange a Firebase ID token for our backend JWT, store it, and return the merged user object.
const exchangeFirebaseToken = async (firebaseUser, displayName = null) => {
    const idToken = await firebaseUser.getIdToken(/* forceRefresh */ true);
    const { data } = await api.post("/auth/firebase", {
        id_token: idToken,
        name: displayName || firebaseUser.displayName || undefined,
    });
    if (data.token) localStorage.setItem("publicos_token", data.token);
    return data;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshMe = useCallback(async () => {
        try {
            const { data } = await api.get("/auth/me");
            setUser(data);
            return data;
        } catch (e) {
            setUser(null);
            return null;
        }
    }, []);

    useEffect(() => {
        // Backend JWT is the source of truth. Hydrate from /me on mount.
        let mounted = true;
        (async () => {
            await refreshMe();
            if (mounted) setLoading(false);
        })();
        return () => { mounted = false; };
    }, [refreshMe]);

    const login = async ({ email, password }) => {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const data = await exchangeFirebaseToken(cred.user);
        setUser(data);
        return data;
    };

    const register = async ({ email, password, name }) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
            try { await updateProfile(cred.user, { displayName: name }); } catch (_) { /* non-fatal */ }
        }
        const data = await exchangeFirebaseToken(cred.user, name);
        setUser(data);
        return data;
    };

    const googleLogin = async () => {
        const cred = await signInWithPopup(auth, googleProvider);
        const data = await exchangeFirebaseToken(cred.user);
        setUser(data);
        return data;
    };

    const forgotPassword = async (email) => {
        await sendPasswordResetEmail(auth, email);
    };

    const logout = async () => {
        try { await fbSignOut(auth); } catch (_) { /* non-fatal */ }
        try { await api.post("/auth/logout"); } catch (_) { /* non-fatal */ }
        localStorage.removeItem("publicos_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, googleLogin, forgotPassword, logout, refreshMe }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
