import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
    const { googleExchange } = useAuth();
    const nav = useNavigate();
    const loc = useLocation();
    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) return;
        processed.current = true;

        const hash = loc.hash || window.location.hash;
        const m = hash.match(/session_id=([^&]+)/);
        if (!m) {
            nav("/login", { replace: true });
            return;
        }
        const sessionId = decodeURIComponent(m[1]);
        googleExchange(sessionId)
            .then((data) => {
                window.history.replaceState({}, document.title, "/me");
                nav(data.role === "admin" ? "/admin" : "/me", { replace: true });
            })
            .catch(() => nav("/login?error=google", { replace: true }));
    }, [googleExchange, loc.hash, nav]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center" data-testid="auth-callback">
            <div className="text-center">
                <Loader2 className="animate-spin text-[#FF9933] mx-auto mb-3" size={32} />
                <p className="text-sm text-slate-500">Signing you in…</p>
            </div>
        </div>
    );
}
