import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api, formatApiError } from "../lib/api";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, Lock, CheckCircle2, AlertTriangle } from "lucide-react";
import BrandLogo from "../components/shared/BrandLogo";

export default function ResetPassword() {
    const [params] = useSearchParams();
    const token = params.get("token") || "";
    const nav = useNavigate();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);
    const [err, setErr] = useState("");
    const [validating, setValidating] = useState(!!token);
    const [tokenErr, setTokenErr] = useState("");
    const [emailHint, setEmailHint] = useState("");

    useEffect(() => {
        if (!token) return;
        let mounted = true;
        api.post("/auth/reset-password/validate", { token })
            .then((r) => { if (mounted) setEmailHint(r.data?.email || ""); })
            .catch((e) => { if (mounted) setTokenErr(formatApiError(e)); })
            .finally(() => { if (mounted) setValidating(false); });
        return () => { mounted = false; };
    }, [token]);

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        if (password.length < 6) { setErr("Password must be at least 6 characters"); return; }
        if (password !== confirm) { setErr("Passwords don't match"); return; }
        setBusy(true);
        try {
            await api.post("/auth/reset-password", { token, password });
            setDone(true);
            setTimeout(() => nav("/login"), 2000);
        } catch (e) {
            setErr(formatApiError(e));
        } finally {
            setBusy(false);
        }
    };

    if (!token || tokenErr) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-6" data-testid="reset-invalid">
                <div className="text-center max-w-sm">
                    <AlertTriangle size={36} className="mx-auto text-amber-600 mb-3" />
                    <h1 className="font-serif text-2xl text-[#0A192F] mb-2">Reset link unavailable</h1>
                    <p className="text-sm text-slate-500 mb-4">{tokenErr || "This password reset link is missing or malformed."}</p>
                    <Link to="/forgot-password" className="text-[#FF9933] font-semibold hover:underline">Request a new link</Link>
                </div>
            </div>
        );
    }

    if (validating) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center" data-testid="reset-validating">
                <Loader2 size={28} className="animate-spin text-[#FF9933]" />
            </div>
        );
    }

    return (
        <div data-testid="page-reset" className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white border border-[#0A192F]/10 rounded-xl p-7 md:p-9">
                <div className="text-center mb-7">
                    <div className="inline-block mb-5"><BrandLogo height={32} /></div>
                    <h1 className="font-serif text-2xl md:text-3xl text-[#0A192F]">Set a new password.</h1>
                    {emailHint && <p className="text-xs text-slate-500 mt-2">For <span className="font-semibold text-[#0A192F]">{emailHint}</span></p>}
                </div>

                {done ? (
                    <div className="text-center space-y-3" data-testid="reset-success">
                        <CheckCircle2 size={36} className="mx-auto text-emerald-600" strokeWidth={1.5} />
                        <h2 className="font-serif text-xl">Password updated.</h2>
                        <p className="text-sm text-slate-500">Redirecting you to login…</p>
                    </div>
                ) : (
                    <form onSubmit={submit} className="space-y-4" data-testid="reset-form">
                        <div className="space-y-1.5">
                            <Label htmlFor="pwd">New password</Label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input id="pwd" data-testid="reset-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pl-9 h-11 bg-white" placeholder="6+ characters" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="cf">Confirm password</Label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input id="cf" data-testid="reset-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} className="pl-9 h-11 bg-white" placeholder="Repeat new password" />
                            </div>
                        </div>
                        {err && <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2.5">{err}</div>}
                        <button type="submit" disabled={busy} data-testid="reset-submit" className="w-full bg-[#0A192F] text-white font-semibold py-3 rounded-md hover:bg-[#FF9933] disabled:opacity-60 flex items-center justify-center gap-2">
                            {busy && <Loader2 size={16} className="animate-spin" />} Update password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
