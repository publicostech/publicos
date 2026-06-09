import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Loader2, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { api, formatApiError } from "../../lib/api";
import { useLang } from "../../lib/i18n";
import { toast } from "sonner";

export default function WaitlistStrip() {
    const { t } = useLang();
    const [email, setEmail] = useState("");
    const [city, setCity] = useState("");
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(null); // {position, city, already_joined}

    const submit = async (e) => {
        e.preventDefault();
        if (!email || !city) return;
        setBusy(true);
        try {
            const { data } = await api.post("/waitlist", { email: email.trim(), city: city.trim(), source: "landing" });
            setDone(data);
        } catch (err) {
            toast.error(formatApiError(err));
        } finally {
            setBusy(false);
        }
    };

    return (
        <section className="max-w-7xl mx-auto px-6 md:px-12 pt-6 pb-12" data-testid="waitlist-section">
            <div className="relative rounded-2xl overflow-hidden">
                {/* Gradient bg */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(135deg, #FFEAD9 0%, #FFF4CC 30%, #D4F5E1 65%, #DAEFFB 100%)",
                    }}
                />
                <div
                    className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    }}
                />

                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 md:p-12">
                    <div className="lg:col-span-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm border border-[#0A192F]/10 rounded-full mb-4">
                            <Sparkles size={13} className="text-[#FF6B35]" />
                            <span className="overline text-[#0A192F]">{t("landing.waitlist_eyebrow")}</span>
                        </div>
                        <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-[#0A192F] leading-tight mb-4">
                            {t("landing.waitlist_title")}
                        </h2>
                        <p className="text-sm md:text-base text-slate-700 leading-relaxed max-w-md">
                            {t("landing.waitlist_sub")}
                        </p>
                    </div>

                    <div className="lg:col-span-6">
                        <AnimatePresence mode="wait">
                            {done ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white/85 backdrop-blur-md border border-emerald-200 rounded-xl p-7 shadow-sm"
                                    data-testid="waitlist-success"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={24} className="text-emerald-700" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-serif text-2xl text-[#0A192F] mb-1">{t("landing.waitlist_success_title")}</div>
                                            <p className="text-sm text-slate-700 leading-relaxed">
                                                {done.already_joined ? (
                                                    <>
                                                        {t("landing.waitlist_already")} <span className="font-semibold text-[#0A192F]">{done.city}</span>.
                                                    </>
                                                ) : (
                                                    <>
                                                        {t("landing.waitlist_success_body")} <span className="font-semibold text-[#0A192F]">{done.city}</span>.
                                                    </>
                                                )}
                                            </p>
                                            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-[#FF9933]/10 border border-[#FF9933]/30 rounded-full">
                                                <Sparkles size={12} className="text-[#FF6B35]" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B35]">
                                                    {t("landing.waitlist_position")} #{done.position}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={submit}
                                    className="bg-white/85 backdrop-blur-md border border-[#0A192F]/10 rounded-xl p-5 md:p-6 shadow-sm"
                                    data-testid="waitlist-form"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                                        <div className="sm:col-span-3 relative">
                                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder={t("landing.waitlist_email_placeholder")}
                                                data-testid="waitlist-email-input"
                                                className="w-full pl-9 pr-3 py-3 text-sm bg-white border border-[#0A192F]/15 rounded-lg focus:outline-none focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20"
                                            />
                                        </div>
                                        <div className="sm:col-span-2 relative">
                                            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            <input
                                                type="text"
                                                required
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                placeholder={t("landing.waitlist_city_placeholder")}
                                                data-testid="waitlist-city-input"
                                                className="w-full pl-9 pr-3 py-3 text-sm bg-white border border-[#0A192F]/15 rounded-lg focus:outline-none focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={busy}
                                        data-testid="waitlist-submit"
                                        className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-[#0A192F] text-white font-semibold px-5 py-3 rounded-lg hover:bg-[#FF9933] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {busy ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                                        {busy ? "…" : t("landing.waitlist_cta")}
                                        {!busy && <ArrowRight size={14} />}
                                    </button>
                                    <p className="mt-3 text-[11px] text-slate-500 text-center">
                                        {t("landing.waitlist_privacy")}
                                    </p>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
