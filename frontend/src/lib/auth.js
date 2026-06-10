import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "./api";
import {
    auth,
    googleProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    fbSignOut,
    restSignIn,
    restSignUp,
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

const exchangeBackend = async (idToken, name = null) => {
    const { data } = await api.post("/auth/firebase", { id_token: idToken, name: name || undefined });
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
        const fb = await restSignIn(email, password);
        const data = await exchangeBackend(fb.idToken);
        setUser(data);
        return data;
    };

    const register = async ({ email, password, name }) => {
        const fb = await restSignUp(email, password, name);
        const data = await exchangeBackend(fb.idToken, name);
        setUser(data);
        return data;
    };

    const googleLogin = async () => {
        // Google popup uses the Firebase JS SDK (popup flow needs it).
        const cred = await signInWithPopup(auth, googleProvider);
        const idToken = await cred.user.getIdToken(true);
        const data = await exchangeBackend(idToken);
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
