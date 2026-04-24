import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight, TrendingUp, ShieldCheck, Users, MapPin, Clock,
    CheckCircle2, Eye, Hammer, BarChart3, Sparkles,
} from "lucide-react";
import IssueCard from "../components/shared/IssueCard";
import IndiaMap from "../components/shared/IndiaMap";
import {
    ISSUES, PLATFORM_STATS, LIVE_TICKER, CITY_HERO_IMAGES, TOP_CONTRIBUTORS,
} from "../lib/mockData";
import { useLang } from "../lib/i18n";

const Stat = ({ label, value, sub, accent }) => (
    <div className="p-6 md:p-8 border border-[#0A192F]/10 bg-white rounded-lg" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
        <div className="overline text-slate-500 mb-3">{label}</div>
        <div className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
            {value}
        </div>
        {sub && (
            <div className={`text-xs mt-2 font-mono tracking-tight ${accent || "text-slate-500"}`}>
                {sub}
            </div>
        )}
    </div>
);

export default function Landing() {
    const { t } = useLang();
    const featured = ISSUES.slice(0, 3);

    return (
        <div data-testid="page-landing">
            {/* HERO */}
            <section className="relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    }}
                />
                <div className="max-w-7xl mx-auto px-6 md:px-12 pt-14 md:pt-20 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-7 space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#0A192F]/15 rounded-full bg-white">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                <span className="overline text-slate-600">
                                    {t("hero.eyebrow")}
                                </span>
                            </div>
                            <motion.h1
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7 }}
                                className="font-serif font-semibold text-5xl md:text-7xl leading-[0.95] tracking-tight text-[#0A192F]"
                            >
                                Every pothole.
                                <br />
                                Every complaint.
                                <br />
                                <span className="italic text-[#FF9933]">Every promise kept.</span>
                            </motion.h1>
                            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                                {t("hero.subtitle")}
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <Link
                                    to="/submit"
                                    data-testid="hero-cta-report"
                                    className="group inline-flex items-center gap-2 bg-[#0A192F] text-white font-semibold px-6 py-3.5 rounded-md hover:bg-[#FF9933] transition-colors"
                                >
                                    {t("hero.cta_primary")}
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/feed"
                                    data-testid="hero-cta-feed"
                                    className="inline-flex items-center gap-2 bg-white border border-[#0A192F]/20 text-[#0A192F] font-semibold px-6 py-3.5 rounded-md hover:border-[#0A192F]"
                                >
                                    {t("hero.cta_secondary")}
                                </Link>
                            </div>
                            <div className="pt-6 flex flex-wrap gap-x-8 gap-y-3 text-xs text-slate-500 border-t border-[#0A192F]/10 mt-6">
                                <div className="inline-flex items-center gap-1.5">
                                    <ShieldCheck size={14} strokeWidth={1.75} className="text-emerald-700" />
                                    Anonymous reporting protected
                                </div>
                                <div className="inline-flex items-center gap-1.5">
                                    <Eye size={14} strokeWidth={1.75} />
                                    Every action timestamped publicly
                                </div>
                                <div className="inline-flex items-center gap-1.5">
                                    <Users size={14} strokeWidth={1.75} />
                                    1.8M+ citizens already on board
                                </div>
                            </div>
                        </div>

                        {/* Hero info panel */}
                        <div className="lg:col-span-5">
                            <div className="bg-[#0A192F] text-white rounded-lg overflow-hidden border border-[#0A192F] relative">
                                <div className="p-6 flex items-center justify-between border-b border-white/10">
                                    <div>
                                        <div className="overline text-[#FF9933]">Live Issue</div>
                                        <div className="font-mono text-xs text-white/60 mt-1">#{ISSUES[0].id}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-pulse" />
                                        <span className="text-xs font-semibold">IN PROGRESS</span>
                                    </div>
                                </div>
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img src={ISSUES[0].photos[0]} alt={ISSUES[0].title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-6 space-y-3">
                                    <h3 className="font-serif text-xl leading-tight">
                                        {ISSUES[0].title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs text-white/60">
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin size={12} />
                                            {ISSUES[0].location.city}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Clock size={12} />
                                            4h response time
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                        <div className="flex -space-x-2">
                                            <div className="w-7 h-7 rounded-full border-2 border-[#0A192F] bg-[#FF9933]" />
                                            <div className="w-7 h-7 rounded-full border-2 border-[#0A192F] bg-[#138808]" />
                                            <div className="w-7 h-7 rounded-full border-2 border-[#0A192F] bg-white" />
                                        </div>
                                        <div className="text-xs text-white/60">
                                            <span className="font-mono text-[#FF9933]">{ISSUES[0].upvotes.toLocaleString()}</span> citizens supporting
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LIVE TICKER */}
            <section className="bg-[#0A192F] text-white py-3 border-y-2 border-[#FF9933] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center gap-6">
                    <div className="overline text-[#FF9933] shrink-0 inline-flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse" />
                        Live Pulse
                    </div>
                    <div className="overflow-hidden flex-1">
                        <div className="flex gap-12 animate-ticker whitespace-nowrap">
                            {[...LIVE_TICKER, ...LIVE_TICKER].map((item, i) => (
                                <span key={i} className="text-sm font-medium">
                                    <span className="text-[#FF9933] mr-2">●</span>
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS BENTO */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
                <div className="mb-12 md:flex items-end justify-between gap-8">
                    <div>
                        <div className="overline text-[#FF9933] mb-3">The public ledger</div>
                        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F] max-w-3xl">
                            India's civic pulse, in numbers that won't let anyone hide.
                        </h2>
                    </div>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A192F] hover:text-[#FF9933] shrink-0"
                        data-testid="landing-dashboard-link"
                    >
                        Full analytics
                        <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5 md:row-span-2 bg-[#0A192F] text-white rounded-lg p-8 flex flex-col justify-between min-h-[260px]">
                        <div className="overline text-[#FF9933]">Total issues reported</div>
                        <div>
                            <div className="font-serif text-7xl md:text-8xl tracking-tighter">
                                {(PLATFORM_STATS.total_reports / 1000).toFixed(0)}K+
                            </div>
                            <div className="text-sm text-white/60 mt-2 font-mono">
                                247,893 and counting · since 2024
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#FF9933]">
                            <TrendingUp size={14} /> +18% month over month
                        </div>
                    </div>
                    <Stat label="Resolved" value={`${Math.round((PLATFORM_STATS.resolved / PLATFORM_STATS.total_reports) * 100)}%`} sub="168,421 closed with proof" accent="text-emerald-700" />
                    <Stat label="Avg resolution" value={`${PLATFORM_STATS.avg_resolution_days}d`} sub="faster than SLA in 7 states" />
                    <Stat label="Cities live" value={PLATFORM_STATS.cities} sub="across 28 states + 8 UTs" />
                    <Stat label="Officials onboard" value={`${(PLATFORM_STATS.officials / 1000).toFixed(1)}K`} sub="from ward to state level" accent="text-[#FF9933]" />
                    <div className="md:col-span-3 bg-[#FF9933] text-white rounded-lg p-6 flex flex-col justify-between min-h-[160px]">
                        <div className="overline text-white/80">Citizens</div>
                        <div>
                            <div className="font-serif text-5xl tracking-tight">
                                {(PLATFORM_STATS.citizens / 1000000).toFixed(1)}M
                            </div>
                            <div className="text-xs mt-1 font-mono text-white/80">watching · reporting · upvoting</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-white border-y border-[#0A192F]/10">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
                    <div className="max-w-2xl mb-12">
                        <div className="overline text-[#FF9933] mb-3">The loop</div>
                        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
                            Report. Route. Resolve. Repeat — on the public record.
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                n: "01",
                                icon: Sparkles,
                                title: "Citizen reports",
                                text: "Snap, describe, drop a pin. GPS captures location. Urgency auto-suggested by AI. Anonymous if you prefer.",
                            },
                            {
                                n: "02",
                                icon: Hammer,
                                title: "Officials act",
                                text: "Auto-routed to correct department. SLA clock starts. Officers assign, update status, upload proof — every step logged.",
                            },
                            {
                                n: "03",
                                icon: BarChart3,
                                title: "Public audits",
                                text: "Every citizen sees the timeline. Dashboards rank states, districts, departments. Accountability becomes ambient.",
                            },
                        ].map((step) => (
                            <div
                                key={step.n}
                                data-testid={`how-step-${step.n}`}
                                className="bg-[#FAF9F6] border border-[#0A192F]/10 rounded-lg p-8 hover:border-[#0A192F]/30 hover:-translate-y-1 transition-all"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <span className="font-mono text-sm text-slate-400">{step.n}</span>
                                    <step.icon size={20} strokeWidth={1.5} className="text-[#FF9933]" />
                                </div>
                                <h3 className="font-serif text-2xl mb-3 text-[#0A192F]">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED ISSUES */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
                <div className="flex items-end justify-between mb-10 gap-8">
                    <div>
                        <div className="overline text-[#FF9933] mb-3">Trending right now</div>
                        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
                            What India is talking about today
                        </h2>
                    </div>
                    <Link to="/feed" className="text-sm font-semibold text-[#0A192F] hover:text-[#FF9933] inline-flex items-center gap-2 shrink-0" data-testid="featured-view-all">
                        View all <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featured.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} />
                    ))}
                </div>
            </section>

            {/* MAP TEASER */}
            <section className="bg-[#FAF9F6] border-y border-[#0A192F]/10">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-5 space-y-6">
                            <div className="overline text-[#FF9933]">Live heat map</div>
                            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
                                Which state is pulling its weight — and which isn't?
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                A public, zoomable heat map of every reported issue across India.
                                Drill down from country to ward. Compare states. See why Kerala closes
                                faster than UP. No spin. Just data.
                            </p>
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <div className="bg-white border border-[#0A192F]/10 rounded-md p-4">
                                    <div className="overline text-emerald-700 mb-1">Top performer</div>
                                    <div className="font-serif text-2xl">Kerala</div>
                                    <div className="text-xs font-mono text-slate-500">5.2d avg · 92 score</div>
                                </div>
                                <div className="bg-white border border-[#0A192F]/10 rounded-md p-4">
                                    <div className="overline text-red-700 mb-1">Needs attention</div>
                                    <div className="font-serif text-2xl">Bihar</div>
                                    <div className="text-xs font-mono text-slate-500">15.6d avg · 54 score</div>
                                </div>
                            </div>
                            <Link
                                to="/map"
                                data-testid="landing-map-link"
                                className="inline-flex items-center gap-2 bg-[#0A192F] text-white font-semibold px-5 py-3 rounded-md hover:bg-[#FF9933] transition-colors"
                            >
                                Open full map <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="lg:col-span-7 bg-white border border-[#0A192F]/10 rounded-lg p-4">
                            <IndiaMap />
                        </div>
                    </div>
                </div>
            </section>

            {/* CITIES */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
                <div className="mb-10">
                    <div className="overline text-[#FF9933] mb-3">Live in</div>
                    <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
                        284 cities. And counting.
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: "Mumbai", issues: "9,245", resolved: "73%", img: CITY_HERO_IMAGES.mumbai },
                        { name: "Bengaluru", issues: "5,502", resolved: "77%", img: CITY_HERO_IMAGES.bangalore },
                        { name: "Delhi", issues: "4,213", resolved: "74%", img: CITY_HERO_IMAGES.delhi },
                    ].map((c) => (
                        <div key={c.name} className="relative rounded-lg overflow-hidden aspect-[4/5] group cursor-pointer" data-testid={`city-card-${c.name.toLowerCase()}`}>
                            <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/40 to-transparent" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                                <div className="flex justify-between">
                                    <span className="overline text-[#FF9933]">Active</span>
                                    <span className="font-mono text-xs text-white/80">{c.resolved} resolved</span>
                                </div>
                                <div>
                                    <div className="font-serif text-4xl mb-1">{c.name}</div>
                                    <div className="font-mono text-sm text-white/70">{c.issues} open issues</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* LEADERBOARD */}
            <section className="bg-[#0A192F] text-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-5">
                            <div className="overline text-[#FF9933] mb-3">Citizen honour roll</div>
                            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
                                The quiet few who won't stop reporting.
                            </h2>
                            <p className="text-white/70 leading-relaxed mt-5">
                                Reputation points aren't gamified fluff. They reflect how many reports
                                actually led to resolution. Officials see your track record too.
                            </p>
                        </div>
                        <div className="lg:col-span-7 space-y-3">
                            {TOP_CONTRIBUTORS.map((u, i) => (
                                <div
                                    key={u.name}
                                    data-testid={`leaderboard-item-${i}`}
                                    className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <div className="font-serif text-3xl text-[#FF9933] w-10 shrink-0">
                                        {String(i + 1).padStart(2, "0")}
                                    </div>
                                    <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold truncate">{u.name}</div>
                                        <div className="text-xs text-white/50 font-mono">{u.city} · {u.reports} reports · {u.resolved} resolved</div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="font-mono text-[#FF9933] font-bold">{u.points.toLocaleString()}</div>
                                        <div className="text-[10px] uppercase tracking-widest text-white/50">pts</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
                <div className="bg-[#FAF9F6] border border-[#0A192F]/15 rounded-lg p-10 md:p-16 text-center">
                    <CheckCircle2 size={28} strokeWidth={1.5} className="mx-auto text-emerald-700 mb-4" />
                    <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-[#0A192F] max-w-3xl mx-auto leading-tight">
                        The next pothole you ignore could be the one that gets fixed today.
                    </h2>
                    <p className="text-slate-600 mt-5 max-w-xl mx-auto">
                        Takes 90 seconds. No OTP needed to browse. Anonymous option always available.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3 justify-center">
                        <Link
                            to="/submit"
                            data-testid="cta-final-report"
                            className="inline-flex items-center gap-2 bg-[#0A192F] text-white font-semibold px-6 py-3.5 rounded-md hover:bg-[#FF9933] transition-colors"
                        >
                            Report your first issue <ArrowRight size={15} />
                        </Link>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 bg-white border border-[#0A192F]/20 text-[#0A192F] font-semibold px-6 py-3.5 rounded-md hover:border-[#0A192F]"
                        >
                            See state rankings
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
