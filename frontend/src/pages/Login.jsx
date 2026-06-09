import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { formatApiError } from "../lib/api";
import BrandLogo from "../components/shared/BrandLogo";

export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const loc = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        setBusy(true);
        try {
            const data = await login({ email, password });
            toast.success(`Welcome back, ${data.name.split(" ")[0]}`);
            const dest = loc.state?.from || (data.role === "admin" ? "/admin" : "/me");
            nav(dest, { replace: true });
        } catch (e) {
            setErr(formatApiError(e));
        } finally {
            setBusy(false);
        }
    };

    const googleLogin = () => {
        // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
        const redirectUrl = window.location.origin + "/me";
        window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
    };

    return (
        <div data-testid="page-login" className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white border border-[#0A192F]/10 rounded-xl p-7 md:p-9">
                <div className="text-center mb-7">
                    <div className="inline-block mb-5"><BrandLogo height={32} /></div>
                    <h1 className="font-serif text-2xl md:text-3xl text-[#0A192F]">Welcome back.</h1>
                    <p className="text-sm text-slate-500 mt-1.5">Log in to report and follow civic issues.</p>
                </div>

                <button
                    onClick={googleLogin}
                    type="button"
                    data-testid="google-login-btn"
                    className="w-full flex items-center justify-center gap-3 border border-[#0A192F]/15 rounded-md py-2.5 hover:border-[#0A192F] transition-colors font-semibold text-sm"
                >
                    <svg width="18" height="18" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.6,20.5H42V20H24v8h11.3c-1.6,4.7-6.1,8-11.3,8c-6.6,0-12-5.4-12-12s5.4-12,12-12c3.1,0,5.8,1.2,7.9,3l5.7-5.7C34.5,6.2,29.5,4,24,4C13,4,4,13,4,24s9,20,20,20s20-9,20-20C44,22.8,43.9,21.6,43.6,20.5z" />
                        <path fill="#FF3D00" d="M6.3,14.7l6.6,4.8C14.7,15.1,18.9,12,24,12c3.1,0,5.8,1.2,7.9,3l5.7-5.7C34.5,6.2,29.5,4,24,4C16.3,4,9.7,8.3,6.3,14.7z" />
                        <path fill="#4CAF50" d="M24,44c5.4,0,10.3-2.1,14-5.4l-6.5-5.5C29.6,34.7,26.9,36,24,36c-5.2,0-9.6-3.3-11.3-8l-6.5,5C9.5,39.6,16.2,44,24,44z" />
                        <path fill="#1976D2" d="M43.6,20.5H42V20H24v8h11.3c-0.8,2.3-2.3,4.3-4.2,5.7l6.5,5.5C42.1,36,44,30.5,44,24C44,22.8,43.9,21.6,43.6,20.5z" />
                    </svg>
                    Continue with Google
                </button>

                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-[#0A192F]/10" />
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Or with email</span>
                    <div className="flex-1 h-px bg-[#0A192F]/10" />
                </div>

                <form onSubmit={submit} className="space-y-4" data-testid="login-form">
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                                id="email"
                                data-testid="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-9 h-11 bg-white"
                                placeholder="you@gmail.com"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="pwd">Password</Label>
                            <Link to="/forgot-password" className="text-xs text-[#FF9933] font-semibold hover:underline" data-testid="forgot-link">
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                                id="pwd"
                                data-testid="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-9 h-11 bg-white"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    {err && (
                        <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2.5 flex items-start gap-2" data-testid="login-error">
                            <AlertCircle size={14} className="shrink-0 mt-0.5" /> {err}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={busy}
                        data-testid="login-submit"
                        className="w-full bg-[#0A192F] text-white font-semibold py-3 rounded-md hover:bg-[#FF9933] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {busy && <Loader2 size={16} className="animate-spin" />} Log in
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    New to PublicOS?{" "}
                    <Link to="/register" className="text-[#FF9933] font-semibold hover:underline" data-testid="register-link">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}
