import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, Mail, Lock, User, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { formatApiError } from "../lib/api";
import BrandLogo from "../components/shared/BrandLogo";

const REGISTER_VARIANTS = [
    {
        badge: "Founding Citizen",
        headPrefix: "Your city is waiting",
        headItalic: "for you.",
        body: "Every great city starts with one resident who refused to look away. Create an account and join the citizens turning frustration into fixes — one report at a time.",
    },
    {
        badge: "Join the ledger",
        headPrefix: "Be counted",
        headItalic: "from day one.",
        body: "PublicOS launches in your city the moment enough citizens raise their hand. Your signup is more than an account — it's a vote for transparency in the place you call home.",
    },
    {
        badge: "Citizens who showed up",
        headPrefix: "Cities don't fix themselves.",
        headItalic: "We do.",
        body: "Every working streetlight, every patched road, every cleaned drain started with someone who refused to wait for someone else. That someone is about to be you.",
    },
    {
        badge: "Day one matters",
        headPrefix: "Your first report",
        headItalic: "is closer than you think.",
        body: "It takes ninety seconds — a photo, a few words, a pin on the map. By the time your evening tea is done, your concern is on the public record. Permanently.",
    },
];

export default function Register() {
    const { register } = useAuth();
    const nav = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");
    const [variant] = useState(() => REGISTER_VARIANTS[Math.floor(Math.random() * REGISTER_VARIANTS.length)]);

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        if (password.length < 6) {
            setErr("Password must be at least 6 characters");
            return;
        }
        setBusy(true);
        try {
            const data = await register({ name, email, password });
            toast.success(`Welcome to PublicOS, ${data.name.split(" ")[0]}`);
            nav("/me", { replace: true });
        } catch (e) {
            setErr(formatApiError(e));
        } finally {
            setBusy(false);
        }
    };

    const googleSignup = () => {
        // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
        const redirectUrl = window.location.origin + "/me";
        window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
    };

    return (
        <div data-testid="page-register" className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-[#0A192F]">
            <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-160px)]">
                {/* LEFT — Inspiration panel */}
                <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden order-2 lg:order-1">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                "url(https://customer-assets.emergentagent.com/job_civictrack-3/artifacts/4k34a2uq_ChatGPT%20Image%20Jun%2010%2C%202026%2C%2001_22_05%20AM.png)",
                            backgroundSize: "cover",
                            backgroundPosition: "center left",
                            backgroundRepeat: "no-repeat",
                        }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(245deg, rgba(10,25,47,0.85) 0%, rgba(10,25,47,0.55) 45%, rgba(10,25,47,0.05) 100%)",
                        }}
                    />
                    <div className="absolute -bottom-20 -right-16 w-72 h-72 rounded-full blur-3xl bg-[#FF9933]/30" />

                    <div className="relative z-10 text-white flex justify-end">
                        <BrandLogo height={36} invert />
                    </div>

                    <div className="relative z-10 text-white space-y-6 max-w-md ml-auto text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                            <span className="overline text-[#FF9933]">{variant.badge}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse" />
                        </div>
                        <h2 className="font-serif text-3xl xl:text-4xl leading-[1.1] tracking-tight">
                            {variant.headPrefix} <span className="italic text-[#FF9933]">{variant.headItalic}</span>
                        </h2>
                        <p className="text-sm text-white/75 leading-relaxed">
                            {variant.body}
                        </p>
                        <div className="grid grid-cols-2 gap-3 pt-3">
                            <div className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-left">
                                <div className="text-[10px] uppercase tracking-widest text-[#FF9933] font-bold mb-1">90 seconds</div>
                                <div className="text-xs text-white/70 leading-tight">From signup to first report.</div>
                            </div>
                            <div className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-left">
                                <div className="text-[10px] uppercase tracking-widest text-[#FF9933] font-bold mb-1">Free, forever</div>
                                <div className="text-xs text-white/70 leading-tight">No fees. No paywalls. Ever.</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 text-[10px] uppercase tracking-widest text-white/40 font-mono text-right">
                        Empowering Citizens · Enabling Accountability
                    </div>
                </div>

                {/* RIGHT — Auth form */}
                <div className="relative flex items-center justify-center px-4 py-12 sm:px-8 bg-[#FAF9F6] lg:bg-white order-1 lg:order-2">
                    <div className="absolute inset-0 lg:hidden" style={{ background: "linear-gradient(135deg, #E8DCFB 0%, #DAEFFB 50%, #FFEAD9 100%)" }} />
                    <div className="relative w-full max-w-md bg-white border border-[#0A192F]/10 rounded-2xl p-7 md:p-10 shadow-[0_20px_60px_-20px_rgba(10,25,47,0.18)]">
                        <div className="text-center mb-7">
                            <div className="inline-block mb-5 lg:hidden"><BrandLogo height={32} /></div>
                            <h1 className="font-serif text-2xl md:text-3xl text-[#0A192F]">Join PublicOS.</h1>
                            <p className="text-sm text-slate-500 mt-1.5">90 seconds to your first civic report.</p>
                        </div>

                        <button
                            onClick={googleSignup}
                            type="button"
                            data-testid="google-signup-btn"
                            className="w-full flex items-center justify-center gap-3 border border-[#0A192F]/15 rounded-md py-2.5 hover:border-[#0A192F] font-semibold text-sm"
                        >
                            <svg width="18" height="18" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.6,20.5H42V20H24v8h11.3c-1.6,4.7-6.1,8-11.3,8c-6.6,0-12-5.4-12-12s5.4-12,12-12c3.1,0,5.8,1.2,7.9,3l5.7-5.7C34.5,6.2,29.5,4,24,4C13,4,4,13,4,24s9,20,20,20s20-9,20-20C44,22.8,43.9,21.6,43.6,20.5z" />
                                <path fill="#FF3D00" d="M6.3,14.7l6.6,4.8C14.7,15.1,18.9,12,24,12c3.1,0,5.8,1.2,7.9,3l5.7-5.7C34.5,6.2,29.5,4,24,4C16.3,4,9.7,8.3,6.3,14.7z" />
                                <path fill="#4CAF50" d="M24,44c5.4,0,10.3-2.1,14-5.4l-6.5-5.5C29.6,34.7,26.9,36,24,36c-5.2,0-9.6-3.3-11.3-8l-6.5,5C9.5,39.6,16.2,44,24,44z" />
                                <path fill="#1976D2" d="M43.6,20.5H42V20H24v8h11.3c-0.8,2.3-2.3,4.3-4.2,5.7l6.5,5.5C42.1,36,44,30.5,44,24C44,22.8,43.9,21.6,43.6,20.5z" />
                            </svg>
                            Sign up with Google
                        </button>

                        <div className="flex items-center gap-3 my-5">
                            <div className="flex-1 h-px bg-[#0A192F]/10" />
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Or with email</span>
                            <div className="flex-1 h-px bg-[#0A192F]/10" />
                        </div>

                        <form onSubmit={submit} className="space-y-4" data-testid="register-form">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Full name</Label>
                                <div className="relative">
                                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input id="name" data-testid="register-name" value={name} onChange={(e) => setName(e.target.value)} required className="pl-9 h-11 bg-white" placeholder="Your name" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input id="email" data-testid="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-9 h-11 bg-white" placeholder="you@gmail.com" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="pwd">Password</Label>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input id="pwd" data-testid="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pl-9 h-11 bg-white" placeholder="6+ characters" />
                                </div>
                            </div>
                            {err && (
                                <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2.5 flex items-start gap-2" data-testid="register-error">
                                    <AlertCircle size={14} className="shrink-0 mt-0.5" /> {err}
                                </div>
                            )}
                            <button type="submit" disabled={busy} data-testid="register-submit" className="w-full bg-[#0A192F] text-white font-semibold py-3 rounded-md hover:bg-[#FF9933] disabled:opacity-60 flex items-center justify-center gap-2">
                                {busy && <Loader2 size={16} className="animate-spin" />} Create account
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Already have an account?{" "}
                            <Link to="/login" className="text-[#FF9933] font-semibold hover:underline" data-testid="login-link">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
