import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatApiError } from "../lib/api";
import { useAuth } from "../lib/auth";
import { formatFirebaseError } from "../lib/firebase";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import BrandLogo from "../components/shared/BrandLogo";

export default function ForgotPassword() {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [sent, setSent] = useState(false);
    const [err, setErr] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        setBusy(true);
        try {
            await forgotPassword(email);
            setSent(true);
        } catch (e) {
            // Firebase intentionally returns errors only for malformed emails — we still show success
            // for auth/user-not-found to prevent email enumeration.
            if (e?.code === "auth/user-not-found") {
                setSent(true);
            } else {
                setErr(e?.code ? formatFirebaseError(e) : formatApiError(e));
            }
        } finally {
            setBusy(false);
        }
    };

    return (
        <div data-testid="page-forgot" className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white border border-[#0A192F]/10 rounded-xl p-7 md:p-9">
                <div className="text-center mb-7">
                    <div className="inline-block mb-5"><BrandLogo height={32} /></div>
                    <h1 className="font-serif text-2xl md:text-3xl text-[#0A192F]">Forgot your password?</h1>
                    <p className="text-sm text-slate-500 mt-1.5">
                        We'll email you a secure reset link from Firebase.
                    </p>
                </div>

                {sent ? (
                    <div className="text-center space-y-4" data-testid="forgot-success">
                        <CheckCircle2 size={36} className="mx-auto text-emerald-600" strokeWidth={1.5} />
                        <h2 className="font-serif text-xl text-[#0A192F]">Check your inbox.</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            If an account exists for <strong>{email}</strong>, a password reset link is on its way. Check your spam folder if you don't see it within a minute.
                        </p>
                        <Link to="/login" className="inline-block text-sm font-semibold text-[#FF9933] hover:underline">
                            Back to login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={submit} className="space-y-4" data-testid="forgot-form">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input id="email" data-testid="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-9 h-11 bg-white" placeholder="you@gmail.com" />
                            </div>
                        </div>
                        {err && <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2.5">{err}</div>}
                        <button type="submit" disabled={busy} data-testid="forgot-submit" className="w-full bg-[#0A192F] text-white font-semibold py-3 rounded-md hover:bg-[#FF9933] disabled:opacity-60 flex items-center justify-center gap-2">
                            {busy && <Loader2 size={16} className="animate-spin" />} Send reset link
                        </button>
                        <Link to="/login" className="block text-center text-sm text-slate-500 hover:text-[#FF9933]">
                            Back to login
                        </Link>
                    </form>
                )}
            </div>
        </div>
    );
}
