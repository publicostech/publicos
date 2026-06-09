import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight, TrendingUp, ShieldCheck, Users, MapPin, Clock,
    CheckCircle2, Eye, Hammer, BarChart3, Sparkles,
} from "lucide-react";
import IssueCard from "../components/shared/IssueCard";
import LeafletIssueMap from "../components/shared/LeafletIssueMap";
import IndiaChoropleth from "../components/shared/IndiaChoropleth";
import LiveIssuePanel from "../components/shared/LiveIssuePanel";
import {
    ISSUES, PLATFORM_STATS, LIVE_TICKER, CITY_HERO_IMAGES, TOP_CONTRIBUTORS, CATEGORIES,
} from "../lib/mockData";
import { useLang } from "../lib/i18n";

const Stat = ({ label, value, sub, accent, className = "" }) => (
    <div
        className={`p-6 md:p-7 border border-[#0A192F]/10 bg-white rounded-lg flex flex-col justify-between min-h-[160px] ${className}`}
        data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
        <div className="overline text-slate-500">{label}</div>
        <div>
            <div className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F] leading-none">
                {value}
            </div>
            {sub && (
                <div className={`text-xs mt-2 font-mono tracking-tight ${accent || "text-slate-500"}`}>
                    {sub}
                </div>
            )}
        </div>
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
                                {t("hero.title_l1")}
                                <br />
                                {t("hero.title_l2")}
                                <br />
                                <span className="italic text-[#FF9933]">{t("hero.title_l3")}</span>
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
                                    {t("hero.trust_anon")}
                                </div>
                                <div className="inline-flex items-center gap-1.5">
                                    <Eye size={14} strokeWidth={1.75} />
                                    {t("hero.trust_audit")}
                                </div>
                                <div className="inline-flex items-center gap-1.5">
                                    <Users size={14} strokeWidth={1.75} />
                                    {t("hero.trust_users")}
                                </div>
                            </div>
                        </div>

                        {/* Hero info panel */}
                        <div className="lg:col-span-5">
                            <LiveIssuePanel />
                        </div>
                    </div>
                </div>
            </section>

            {/* LIVE TICKER */}
            <section className="bg-[#0A192F] text-white py-3 border-y-2 border-[#FF9933] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center gap-6">
                    <div className="overline text-[#FF9933] shrink-0 inline-flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse" />
                        {t("landing.ticker")}
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
                        <div className="overline text-[#FF9933] mb-3">{t("landing.stats_eyebrow")}</div>
                        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F] max-w-3xl">
                            {t("landing.stats_title")}
                        </h2>
                    </div>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A192F] hover:text-[#FF9933] shrink-0"
                        data-testid="landing-dashboard-link"
                    >
                        {t("landing.stats_cta")}
                        <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5 md:row-span-2 bg-[#0A192F] text-white rounded-lg p-8 flex flex-col justify-between min-h-[260px]">
                        <div className="overline text-[#FF9933]">{t("landing.stats_total")}</div>
                        <div>
                            <div className="font-serif text-7xl md:text-8xl tracking-tighter">
                                {(PLATFORM_STATS.total_reports / 1000).toFixed(0)}K+
                            </div>
                            <div className="text-sm text-white/60 mt-2 font-mono">
                                {t("landing.stats_total_sub")}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#FF9933]">
                            <TrendingUp size={14} /> {t("landing.stats_growth")}
                        </div>
                    </div>
                    <Stat
                        className="md:col-span-2"
                        label={t("landing.stats_resolved")}
                        value={`${Math.round((PLATFORM_STATS.resolved / PLATFORM_STATS.total_reports) * 100)}%`}
                        sub={t("landing.stats_resolved_sub")}
                        accent="text-emerald-700"
                    />
                    <Stat
                        className="md:col-span-2"
                        label={t("landing.stats_avg")}
                        value={`${PLATFORM_STATS.avg_resolution_days}d`}
                        sub={t("landing.stats_avg_sub")}
                    />
                    <div className="md:col-span-3 md:row-span-2 bg-[#FF9933] text-white rounded-lg p-6 flex flex-col justify-between min-h-[160px]">
                        <div className="overline text-white/80">{t("landing.stats_citizens")}</div>
                        <div>
                            <div className="font-serif text-6xl tracking-tight leading-none">
                                {(PLATFORM_STATS.citizens / 1000000).toFixed(1)}M
                            </div>
                            <div className="text-xs mt-2 font-mono text-white/80">{t("landing.stats_citizens_sub")}</div>
                        </div>
                        <div className="text-[11px] font-mono text-white/70">
                            {t("landing.stats_citizens_growth")}
                        </div>
                    </div>
                    <Stat
                        className="md:col-span-2"
                        label={t("landing.stats_cities")}
                        value={PLATFORM_STATS.cities}
                        sub={t("landing.stats_cities_sub")}
                    />
                    <Stat
                        className="md:col-span-2"
                        label={t("landing.stats_officials")}
                        value={`${(PLATFORM_STATS.officials / 1000).toFixed(1)}K`}
                        sub={t("landing.stats_officials_sub")}
                        accent="text-[#FF9933]"
                    />
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-white border-y border-[#0A192F]/10">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
                    <div className="max-w-2xl mb-12">
                        <div className="overline text-[#FF9933] mb-3">{t("landing.loop_eyebrow")}</div>
                        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
                            {t("landing.loop_title")}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { n: "01", icon: Sparkles, titleKey: "landing.step1_title", textKey: "landing.step1_text" },
                            { n: "02", icon: Hammer, titleKey: "landing.step2_title", textKey: "landing.step2_text" },
                            { n: "03", icon: BarChart3, titleKey: "landing.step3_title", textKey: "landing.step3_text" },
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
                                    {t(step.titleKey)}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{t(step.textKey)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED ISSUES */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
                <div className="flex items-end justify-between mb-10 gap-8">
                    <div>
                        <div className="overline text-[#FF9933] mb-3">{t("landing.trending_eyebrow")}</div>
                        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
                            {t("landing.trending_title")}
                        </h2>
                    </div>
                    <Link to="/feed" className="text-sm font-semibold text-[#0A192F] hover:text-[#FF9933] inline-flex items-center gap-2 shrink-0" data-testid="featured-view-all">
                        {t("common.view_all")} <ArrowRight size={14} />
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
                            <div className="overline text-[#FF9933]">{t("landing.map_eyebrow")}</div>
                            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
                                {t("landing.map_title")}
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                {t("landing.map_sub")}
                            </p>
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <div className="bg-white border border-[#0A192F]/10 rounded-md p-4">
                                    <div className="overline text-emerald-700 mb-1">{t("landing.map_top")}</div>
                                    <div className="font-serif text-2xl">Kerala</div>
                                    <div className="text-xs font-mono text-slate-500">5.2d avg · 92 score</div>
                                </div>
                                <div className="bg-white border border-[#0A192F]/10 rounded-md p-4">
                                    <div className="overline text-red-700 mb-1">{t("landing.map_bottom")}</div>
                                    <div className="font-serif text-2xl">Bihar</div>
                                    <div className="text-xs font-mono text-slate-500">15.6d avg · 54 score</div>
                                </div>
                            </div>
                            <Link
                                to="/map"
                                data-testid="landing-map-link"
                                className="inline-flex items-center gap-2 bg-[#0A192F] text-white font-semibold px-5 py-3 rounded-md hover:bg-[#FF9933] transition-colors"
                            >
                                {t("landing.map_cta")} <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="lg:col-span-7 bg-white border border-[#0A192F]/10 rounded-lg p-2 overflow-hidden">
                            <IndiaChoropleth height={640} showLabels={true} />
                        </div>
                    </div>
                </div>
            </section>

            {/* CITIES */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
                <div className="mb-10">
                    <div className="overline text-[#FF9933] mb-3">{t("landing.cities_eyebrow")}</div>
                    <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
                        {t("landing.cities_title")}
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
                            <div className="overline text-[#FF9933] mb-3">{t("landing.leaderboard_eyebrow")}</div>
                            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
                                {t("landing.leaderboard_title")}
                            </h2>
                            <p className="text-white/70 leading-relaxed mt-5">
                                {t("landing.leaderboard_sub")}
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

            {/* EVERY ISSUE — Category showcase */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
                <div className="mb-12 flex items-end justify-between gap-8 flex-wrap">
                    <div>
                        <div className="overline text-[#FF9933] mb-3">{t("landing.categories_eyebrow")}</div>
                        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F] max-w-3xl">
                            {t("landing.categories_title")}
                        </h2>
                        <p className="text-slate-600 mt-4 max-w-xl leading-relaxed">
                            {t("landing.categories_sub")}
                        </p>
                    </div>
                    <Link
                        to="/feed"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A192F] hover:text-[#FF9933] shrink-0"
                        data-testid="showcase-view-all"
                    >
                        {t("landing.categories_cta")} <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Bento showcase grid */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:auto-rows-[180px]" data-testid="issue-showcase-grid">
                    {/* Garbage — large tile */}
                    <ShowcaseTile
                        id="CT-2402"
                        category="garbage"
                        tagLabel="Garbage"
                        tagColor="#138808"
                        img="https://images.unsplash.com/photo-1762805544399-7cdf748371e0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwyfHxnYXJiYWdlJTIwc3RyZWV0JTIwaW5kaWFufGVufDB8fHx8MTc3NzAxMTY5NXww&ixlib=rb-4.1.0&q=85"
                        title="Garbage uncollected for 8 days in Sector 14"
                        meta="Gurugram · 634 supporting"
                        span="col-span-2 md:col-span-3 md:row-span-2"
                    />

                    {/* Water leak — small */}
                    <ShowcaseTile
                        id="CT-2403"
                        category="water"
                        tagLabel="Water"
                        tagColor="#3B82F6"
                        img="https://images.pexels.com/photos/15206136/pexels-photo-15206136.jpeg"
                        title="30,000+ litres wasted daily"
                        meta="Hyderabad · Critical"
                        span="col-span-1 md:col-span-2 md:row-span-1"
                    />

                    {/* Pollution — tall tile */}
                    <ShowcaseTile
                        id="CT-2408"
                        category="pollution"
                        tagLabel="Pollution"
                        tagColor="#78716C"
                        img="https://images.pexels.com/photos/15206136/pexels-photo-15206136.jpeg"
                        title="Factory effluent choking Bellandur Lake"
                        meta="Bengaluru · 3,402 supporting"
                        span="col-span-1 md:col-span-1 md:row-span-2"
                        overlay="#0A192F"
                    />

                    {/* Streetlight */}
                    <ShowcaseTile
                        id="CT-2404"
                        category="streetlight"
                        tagLabel="Streetlights"
                        tagColor="#F59E0B"
                        img="https://images.pexels.com/photos/9953451/pexels-photo-9953451.jpeg"
                        title="11 lights out on Anna Nagar"
                        meta="Chennai · Resolved"
                        span="col-span-1 md:col-span-2 md:row-span-1"
                    />

                    {/* Safety — editorial/text tile in saffron */}
                    <div
                        className="col-span-2 md:col-span-2 bg-[#FF9933] text-white rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group"
                        data-testid="showcase-safety"
                    >
                        <div className="overline text-white/80">Safety & Security</div>
                        <div>
                            <div className="font-serif text-2xl leading-tight mb-1">
                                "Every eve-teasing incident logged publicly forces faster patrol deployment."
                            </div>
                            <div className="text-xs text-white/80 mt-3 font-mono">
                                2,956 citizens supporting · Gurugram
                            </div>
                        </div>
                        <ArrowRight
                            size={18}
                            className="self-end group-hover:translate-x-1 transition-transform"
                        />
                    </div>

                    {/* Corruption */}
                    <ShowcaseTile
                        id="CT-2410"
                        category="corruption"
                        tagLabel="Corruption"
                        tagColor="#991B1B"
                        img="https://images.pexels.com/photos/9953451/pexels-photo-9953451.jpeg"
                        title="Ration office bribes exposed"
                        meta="Kochi · 1,893 supporting"
                        span="col-span-1 md:col-span-2 md:row-span-1"
                        overlay="#991B1B"
                    />

                    {/* Schools — big */}
                    <ShowcaseTile
                        id="CT-2411"
                        category="infrastructure"
                        tagLabel="Schools & Hospitals"
                        tagColor="#8B5CF6"
                        img="https://images.pexels.com/photos/11849379/pexels-photo-11849379.jpeg"
                        title="ZP School roof collapsed — 200 students at risk"
                        meta="Wardha · 2,187 supporting"
                        span="col-span-2 md:col-span-2 md:row-span-1"
                    />

                    {/* Traffic — navy dark tile (full width last row) */}
                    <div
                        className="col-span-2 md:col-span-6 bg-[#0A192F] text-white rounded-lg p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
                        data-testid="showcase-traffic"
                    >
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="overline text-[#FF9933]">Traffic</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF9933] bg-[#FF9933]/10 border border-[#FF9933]/40 px-2 py-0.5 rounded">
                                    In progress
                                </span>
                            </div>
                            <div className="font-serif text-2xl md:text-3xl leading-tight">
                                Signal stuck red · 40-minute jams at Connaught Place
                            </div>
                            <div className="font-mono text-[11px] text-white/60">
                                #CT-2407 · New Delhi · 1,556 citizens supporting · Assigned to Delhi Traffic Police
                            </div>
                        </div>
                        <div className="flex gap-6 md:border-l md:border-white/10 md:pl-8">
                            <div>
                                <div className="font-serif text-4xl text-[#FF9933]">40m</div>
                                <div className="overline text-white/50 mt-1">jam time</div>
                            </div>
                            <div>
                                <div className="font-serif text-4xl">4h</div>
                                <div className="overline text-white/50 mt-1">response</div>
                            </div>
                            <div>
                                <div className="font-serif text-4xl text-emerald-400">1.5K</div>
                                <div className="overline text-white/50 mt-1">supporters</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category strip */}
                <div className="mt-10 p-6 md:p-8 bg-[#0A192F] text-white rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                        <div className="md:max-w-xs shrink-0">
                            <div className="overline text-[#FF9933] mb-2">13 issue types</div>
                            <div className="font-serif text-2xl leading-tight">
                                One portal. Every category. No civic problem too small, none too inconvenient.
                            </div>
                        </div>
                        <div className="flex-1 flex flex-wrap gap-2" data-testid="showcase-chip-row">
                            {CATEGORIES.map((c) => (
                                <Link
                                    key={c.id}
                                    to={`/feed?category=${c.id}`}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/15 hover:border-white/50 transition-colors"
                                    style={{ color: c.color }}
                                    data-testid={`showcase-chip-${c.id}`}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                                    <span className="text-white">{c.label}</span>
                                </Link>
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
                        {t("landing.cta_title")}
                    </h2>
                    <p className="text-slate-600 mt-5 max-w-xl mx-auto">
                        {t("landing.cta_sub")}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3 justify-center">
                        <Link
                            to="/submit"
                            data-testid="cta-final-report"
                            className="inline-flex items-center gap-2 bg-[#0A192F] text-white font-semibold px-6 py-3.5 rounded-md hover:bg-[#FF9933] transition-colors"
                        >
                            {t("landing.cta_primary")} <ArrowRight size={15} />
                        </Link>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 bg-white border border-[#0A192F]/20 text-[#0A192F] font-semibold px-6 py-3.5 rounded-md hover:border-[#0A192F]"
                        >
                            {t("landing.cta_secondary")}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

const ShowcaseTile = ({ id, category, tagLabel, tagColor, img, title, meta, span, overlay = "#0A192F" }) => (
    <Link
        to={`/issue/${id}`}
        className={`relative rounded-lg overflow-hidden group ${span}`}
        data-testid={`showcase-tile-${category}`}
    >
        <img
            src={img}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to top, ${overlay} 0%, ${overlay}CC 35%, transparent 75%)` }}
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
            <span
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded"
                style={{ background: tagColor, color: "white" }}
            >
                {tagLabel}
            </span>
        </div>
        <div className="absolute top-3 right-3 font-mono text-[10px] text-white/80 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded">
            #{id}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h3 className="font-serif text-lg md:text-xl leading-tight mb-1.5">
                {title}
            </h3>
            <div className="text-[11px] text-white/75 font-mono">{meta}</div>
        </div>
    </Link>
);
