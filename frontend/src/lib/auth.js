import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "./api";

const AuthContext = createContext({
    user: null,
    loading: true,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    refreshMe: async () => {},
});

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
        // Skip /me if we're returning from Google OAuth callback (handled separately)
        if (typeof window !== "undefined" && window.location.hash?.includes("session_id=")) {
            setLoading(false);
            return;
        }
        refreshMe().finally(() => setLoading(false));
    }, [refreshMe]);

    const login = async ({ email, password }) => {
        const { data } = await api.post("/auth/login", { email, password });
        if (data.token) localStorage.setItem("publicos_token", data.token);
        setUser(data);
        return data;
    };

    const register = async ({ email, password, name }) => {
        const { data } = await api.post("/auth/register", { email, password, name });
        if (data.token) localStorage.setItem("publicos_token", data.token);
        setUser(data);
        return data;
    };

    const googleExchange = async (session_id) => {
        const { data } = await api.post("/auth/google/callback", { session_id });
        if (data.token) localStorage.setItem("publicos_token", data.token);
        setUser(data);
        return data;
    };

    const logout = async () => {
        try { await api.post("/auth/logout"); } catch {}
        localStorage.removeItem("publicos_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshMe, googleExchange }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
