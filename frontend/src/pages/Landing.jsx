import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight, ShieldCheck, Users, Eye, BarChart3,
    Construction, Lightbulb, Trash2, Droplets, AlertTriangle, TreePine, Train, MapPin,
    FileText, MessagesSquare, Activity, HandHeart, Sparkles, Award, Building2, Tractor, Landmark, Cpu,
} from "lucide-react";
import IndiaChoropleth from "../components/shared/IndiaChoropleth";
import LiveIssuePanel from "../components/shared/LiveIssuePanel";
import WaitlistStrip from "../components/shared/WaitlistStrip";
import { useLang } from "../lib/i18n";

export default function Landing() {
    const { t, lang } = useLang();

    const tickerPromises = [
        t("landing.ticker_promise_1"),
        t("landing.ticker_promise_2"),
        t("landing.ticker_promise_3"),
        t("landing.ticker_promise_4"),
        t("landing.ticker_promise_5"),
        t("landing.ticker_promise_6"),
    ];

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
                <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 pt-14 md:pt-20 pb-20">
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
                                className={`font-serif font-semibold leading-[0.95] tracking-tight text-[#0A192F] ${
                                    lang === "hi" || lang === "te"
                                        ? "text-4xl md:text-6xl"
                                        : "text-5xl md:text-7xl"
                                }`}
                            >
                                {t("hero.title_l1")}
                                <br />
                                <span className="italic text-[#FF9933]">{t("hero.title_l2")}</span>
                            </motion.h1>
                            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                                {t("hero.subtitle")}
                            </p>
                            <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
                                {t("hero.sub2")}
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

                        {/* Hero side panel — rotating mission pillars */}
                        <div className="lg:col-span-5">
                            <LiveIssuePanel />
                        </div>
                    </div>
                </div>
            </section>

            {/* CIVIC PROMISE TICKER */}
            <section className="bg-[#0A192F] text-white py-3 border-y-2 border-[#FF9933] overflow-hidden">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 flex items-center gap-6">
                    <div className="overline text-[#FF9933] shrink-0 inline-flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse" />
                        {t("landing.ticker")}
                    </div>
                    <div className="overflow-hidden flex-1">
                        <div className="flex gap-12 animate-ticker whitespace-nowrap">
                            {[...tickerPromises, ...tickerPromises].map((item, i) => (
                                <span key={i} className="text-sm font-medium">
                                    <span className="text-[#FF9933] mr-2">●</span>
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* MISSION — replaces 'India's Civic Pulse' bento */}
            <section className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 py-14 sm:py-16 md:py-24" data-testid="mission-section">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
                    <div className="lg:col-span-5">
                        <div className="overline text-[#FF9933] mb-3">{t("landing.mission_eyebrow")}</div>
                        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F] leading-tight">
                            {t("landing.mission_title")}
                        </h2>
                    </div>
                    <div className="lg:col-span-7">
                        <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                            {t("landing.mission_sub")}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    <MissionCard
                        icon={Users}
                        accent="#FF9933"
                        title={t("landing.mission_c1_title")}
                        desc={t("landing.mission_c1_desc")}
                        testid="mission-card-citizen"
                    />
                    <MissionCard
                        icon={Eye}
                        accent="#3B82F6"
                        title={t("landing.mission_c2_title")}
                        desc={t("landing.mission_c2_desc")}
                        testid="mission-card-transparent"
                    />
                    <MissionCard
                        icon={ShieldCheck}
                        accent="#138808"
                        title={t("landing.mission_c3_title")}
                        desc={t("landing.mission_c3_desc")}
                        testid="mission-card-accountable"
                    />
                    <MissionCard
                        icon={BarChart3}
                        accent="#8B5CF6"
                        title={t("landing.mission_c4_title")}
                        desc={t("landing.mission_c4_desc")}
                        testid="mission-card-data"
                    />
                </div>
            </section>

            {/* HOW IT WORKS — 4 steps with colorful cards */}
            <section className="bg-[#FAF9F6] border-y border-[#0A192F]/5">
                <div className="max-w-7xl mx-auto px-5 sm:px-5 sm:px-6 md:px-12 py-12 sm:py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start mb-8 md:mb-12">
                        <div className="lg:col-span-5">
                            <div className="overline text-[#FF9933] mb-2 md:mb-3">{t("landing.loop_eyebrow")}</div>
                            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#0A192F] leading-tight">
                                {t("landing.loop_title")}
                            </h2>
                            <p className="text-sm md:text-base text-slate-600 leading-relaxed mt-4 max-w-md">
                                {t("landing.loop_sub")}
                            </p>
                            <Link
                                to="/submit"
                                className="inline-flex items-center gap-2 mt-5 md:mt-7 bg-[#FF9933] text-white font-semibold px-5 py-3 rounded-lg hover:bg-[#0A192F] transition-colors"
                                data-testid="how-learn-more"
                            >
                                {t("landing.how_learn_more")} <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            {[
                                { n: 1, icon: FileText, titleKey: "landing.step1_title", textKey: "landing.step1_text", bg: "#FFEAD9", badge: "#FF6B35" },
                                { n: 2, icon: MessagesSquare, titleKey: "landing.step2_title", textKey: "landing.step2_text", bg: "#FFF4CC", badge: "#F59E0B" },
                                { n: 3, icon: Activity, titleKey: "landing.step3_title", textKey: "landing.step3_text", bg: "#D4F5E1", badge: "#10B981" },
                                { n: 4, icon: HandHeart, titleKey: "landing.step4_title", textKey: "landing.step4_text", bg: "#DAEFFB", badge: "#3B82F6" },
                            ].map((step) => (
                                <div
                                    key={step.n}
                                    data-testid={`how-step-0${step.n}`}
                                    className="relative rounded-2xl p-4 sm:p-5 pt-8 sm:pt-10 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg min-h-[200px] sm:min-h-[230px] flex flex-col"
                                    style={{ background: step.bg }}
                                >
                                    <div
                                        className="absolute -top-3 left-5 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md border-4 border-white"
                                        style={{ background: step.badge }}
                                    >
                                        {step.n}
                                    </div>
                                    <h3 className="font-serif text-lg text-[#0A192F] leading-tight mb-2 mt-1">
                                        {t(step.titleKey)}
                                    </h3>
                                    <p className="text-xs text-slate-700/80 leading-relaxed flex-1">{t(step.textKey)}</p>
                                    <div className="mt-4 flex justify-end">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/60"
                                            style={{ color: step.badge }}
                                        >
                                            <step.icon size={22} strokeWidth={1.75} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ISSUES THAT MATTER MOST — Community Focus */}
            <section className="bg-white border-y border-[#0A192F]/5">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 py-14 sm:py-16 md:py-24" data-testid="topics-section">
                    <div className="max-w-2xl mb-12 text-center mx-auto">
                        <div className="overline text-[#FF9933] mb-3">{t("landing.topics_eyebrow")}</div>
                        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
                            {t("landing.topics_title")}
                        </h2>
                        <p className="text-slate-600 leading-relaxed mt-4">
                            {t("landing.topics_sub")}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
                        {[
                            { icon: Construction, k: "topic_roads", color: "#FF6B35", bg: "#FFEAD9" },
                            { icon: Lightbulb, k: "topic_lights", color: "#F59E0B", bg: "#FFF4CC" },
                            { icon: Trash2, k: "topic_waste", color: "#10B981", bg: "#D4F5E1" },
                            { icon: Droplets, k: "topic_water", color: "#3B82F6", bg: "#DAEFFB" },
                            { icon: AlertTriangle, k: "topic_traffic", color: "#8B5CF6", bg: "#E8DCFB" },
                            { icon: MapPin, k: "topic_public_spaces", color: "#138808", bg: "#D4F5DC" },
                            { icon: TreePine, k: "topic_env", color: "#059669", bg: "#CFEFE0" },
                            { icon: Train, k: "topic_transport", color: "#EF4444", bg: "#FFE0E0" },
                        ].map((tp) => (
                            <Link
                                key={tp.k}
                                to="/feed"
                                data-testid={`topic-${tp.k}`}
                                className="group rounded-2xl p-5 md:p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center"
                                style={{ background: tp.bg }}
                            >
                                <div
                                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 bg-white/60 backdrop-blur-sm shadow-sm group-hover:scale-110 transition-transform"
                                    style={{ color: tp.color }}
                                >
                                    <tp.icon size={26} strokeWidth={2} />
                                </div>
                                <div className="font-semibold text-sm md:text-base text-[#0A192F] leading-tight">{t(`landing.${tp.k}`)}</div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <Link
                            to="/feed"
                            data-testid="topics-explore-all"
                            className="inline-flex items-center gap-2 bg-white border-2 border-[#0A192F]/10 text-[#0A192F] font-semibold px-6 py-3 rounded-lg hover:border-[#FF9933] hover:text-[#FF9933] transition-colors"
                        >
                            {t("landing.topics_explore_all")} <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* GROWING TOGETHER — Map */}
            <section className="bg-[#FAF9F6] border-y border-[#0A192F]/10">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 py-14 sm:py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-5 space-y-6">
                            <div className="overline text-[#FF9933]">{t("landing.map_eyebrow")}</div>
                            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F] leading-tight">
                                {t("landing.map_title")}
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                {t("landing.map_sub")}
                            </p>
                            <div className="grid grid-cols-3 gap-3 pt-2">
                                <CoverageCount label="Villages" icon={Tractor} />
                                <CoverageCount label="Towns" icon={Building2} />
                                <CoverageCount label="Cities" icon={Landmark} />
                            </div>
                            <Link
                                to="/submit"
                                data-testid="landing-map-cta"
                                className="inline-flex items-center gap-2 bg-[#0A192F] text-white font-semibold px-5 py-3 rounded-md hover:bg-[#FF9933] transition-colors"
                            >
                                {t("landing.map_cta")} <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="lg:col-span-7 bg-white border border-[#0A192F]/10 rounded-lg p-2 overflow-hidden">
                            <IndiaChoropleth height={620} showLabels={true} />
                        </div>
                    </div>
                </div>
            </section>

            {/* BUILT FOR EVERY COMMUNITY */}
            <section className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 py-14 sm:py-16 md:py-24" data-testid="community-section">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
                    <div className="lg:col-span-5">
                        <div className="overline text-[#FF9933] mb-3">{t("landing.cities_eyebrow")}</div>
                        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F] leading-tight">
                            {t("landing.cities_title")}
                        </h2>
                        <p className="text-slate-600 leading-relaxed mt-5">
                            {t("landing.cities_sub")}
                        </p>
                    </div>
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <CommunityCard
                            icon={Tractor}
                            title={t("landing.community_village_title")}
                            desc={t("landing.community_village_desc")}
                            accent="#10B981"
                            bg="#D4F5E1"
                            testid="community-village"
                        />
                        <CommunityCard
                            icon={Building2}
                            title={t("landing.community_town_title")}
                            desc={t("landing.community_town_desc")}
                            accent="#FF6B35"
                            bg="#FFEAD9"
                            testid="community-town"
                        />
                        <CommunityCard
                            icon={Landmark}
                            title={t("landing.community_municipal_title")}
                            desc={t("landing.community_municipal_desc")}
                            accent="#8B5CF6"
                            bg="#E8DCFB"
                            testid="community-municipal"
                        />
                        <CommunityCard
                            icon={Cpu}
                            title={t("landing.community_smart_title")}
                            desc={t("landing.community_smart_desc")}
                            accent="#3B82F6"
                            bg="#DAEFFB"
                            testid="community-smart"
                        />
                    </div>
                </div>
            </section>

            {/* COMMUNITY CHAMPIONS — light themed, colorful circular icons */}
            <section className="bg-white border-y border-[#0A192F]/5" data-testid="champions-section">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 py-14 sm:py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-6">
                            <div className="overline text-[#FF9933] mb-3">{t("landing.champions_eyebrow")}</div>
                            <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[#0A192F]">
                                {t("landing.champions_title")}
                            </h2>
                            <p className="text-slate-600 leading-relaxed mt-5">
                                {t("landing.champions_sub")}
                            </p>

                            <div className="mt-10 flex flex-wrap items-start gap-x-7 gap-y-6">
                                {[
                                    { icon: Award, key: "champ_contrib", color: "#FF6B35", bg: "#FFEAD9" },
                                    { icon: Users, key: "champ_advocates", color: "#10B981", bg: "#D4F5E1" },
                                    { icon: HandHeart, key: "champ_volunteers", color: "#EF4444", bg: "#FFE0E0" },
                                    { icon: Sparkles, key: "champ_changemakers", color: "#8B5CF6", bg: "#E8DCFB" },
                                    { icon: Building2, key: "champ_social", color: "#3B82F6", bg: "#DAEFFB" },
                                ].map((c) => (
                                    <div
                                        key={c.key}
                                        data-testid={`champ-${c.key}`}
                                        className="flex flex-col items-center text-center group cursor-default w-[100px]"
                                    >
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform"
                                            style={{ background: c.bg, color: c.color }}
                                        >
                                            <c.icon size={24} strokeWidth={2} />
                                        </div>
                                        <div className="text-[11px] font-semibold text-[#0A192F] leading-tight">
                                            {t(`landing.${c.key}`)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/feed"
                                className="inline-flex items-center gap-2 mt-10 bg-white border-2 border-[#0A192F]/15 text-[#0A192F] font-semibold px-5 py-3 rounded-lg hover:border-[#FF9933] hover:text-[#FF9933] transition-colors"
                                data-testid="champions-cta"
                            >
                                {t("landing.champ_cta")} <ArrowRight size={14} />
                            </Link>
                        </div>

                        {/* Knowledge Hub teaser — Insights & Stories */}
                        <div className="lg:col-span-6">
                            <div className="overline text-[#FF9933] mb-3">{t("landing.hub_eyebrow")}</div>
                            <h2 className="font-serif text-3xl md:text-4xl tracking-tight leading-tight text-[#0A192F] mb-4">
                                {t("landing.hub_title")}
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                {t("landing.hub_sub")}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { tagKey: "hub_a1_tag", titleKey: "hub_a1_title", bg: "#FFEAD9", tagColor: "#FF6B35", id: "civic-education", img: "https://customer-assets.emergentagent.com/job_civictrack-3/artifacts/ejc93xak_a1.png" },
                                    { tagKey: "hub_a2_tag", titleKey: "hub_a2_title", bg: "#D4F5E1", tagColor: "#10B981", id: "success-story", img: "https://customer-assets.emergentagent.com/job_civictrack-3/artifacts/mg8e5d96_a3.png" },
                                    { tagKey: "hub_a3_tag", titleKey: "hub_a3_title", bg: "#DAEFFB", tagColor: "#3B82F6", id: "smart-governance", img: "https://customer-assets.emergentagent.com/job_civictrack-3/artifacts/8p2gz7xl_a2.png" },
                                ].map((a) => (
                                    <div
                                        key={a.id}
                                        data-testid={`hub-${a.id}`}
                                        className="rounded-xl overflow-hidden bg-[#FAF9F6] border border-[#0A192F]/5 hover:-translate-y-1 transition-all duration-300 hover:shadow-md flex flex-col"
                                    >
                                        <div className="aspect-[5/3] overflow-hidden" style={{ background: a.bg }}>
                                            <img src={a.img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col">
                                            <span
                                                className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded self-start mb-2"
                                                style={{ background: a.bg, color: a.tagColor }}
                                            >
                                                {t(`landing.${a.tagKey}`)}
                                            </span>
                                            <div className="font-serif text-sm text-[#0A192F] leading-tight">{t(`landing.${a.titleKey}`)}</div>
                                            <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: a.tagColor }}>
                                                {t("landing.hub_read_more")} <ArrowRight size={10} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WAITLIST — Founding citizens */}
            <WaitlistStrip />

            {/* FINAL CTA — Dark navy with strong saffron CTA */}
            <section className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 py-12 md:py-16">
                <div className="relative bg-[#0A192F] rounded-2xl overflow-hidden p-10 md:p-14">
                    {/* Subtle city skyline pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.06] pointer-events-none"
                        style={{
                            backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 50' xmlns='http://www.w3.org/2000/svg' fill='%23FF9933'%3E%3Crect x='10' y='25' width='8' height='25'/%3E%3Crect x='22' y='15' width='12' height='35'/%3E%3Crect x='38' y='28' width='6' height='22'/%3E%3Crect x='48' y='10' width='14' height='40'/%3E%3Crect x='66' y='22' width='10' height='28'/%3E%3Crect x='80' y='5' width='8' height='45'/%3E%3Crect x='92' y='20' width='12' height='30'/%3E%3Crect x='108' y='28' width='8' height='22'/%3E%3Crect x='120' y='12' width='10' height='38'/%3E%3Crect x='134' y='22' width='14' height='28'/%3E%3Crect x='152' y='8' width='8' height='42'/%3E%3Crect x='164' y='25' width='12' height='25'/%3E%3Crect x='180' y='18' width='10' height='32'/%3E%3C/svg%3E\")",
                            backgroundSize: "100% auto",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "bottom right",
                        }}
                    />
                    <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-7 text-white">
                            <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-[1.1] mb-5">
                                {t("landing.cta_title")}
                            </h2>
                            <p className="text-white/70 text-sm md:text-base max-w-2xl leading-relaxed">
                                {t("landing.cta_sub")}
                            </p>
                        </div>
                        <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
                            <Link
                                to="/submit"
                                data-testid="cta-final-report"
                                className="inline-flex items-center gap-2 bg-[#FF9933] text-white font-semibold px-6 py-3.5 rounded-lg hover:bg-[#FF7A00] transition-colors shadow-lg"
                            >
                                {t("landing.cta_primary")} <ArrowRight size={15} />
                            </Link>
                            <Link
                                to="/register"
                                data-testid="cta-final-join"
                                className="inline-flex items-center gap-2 bg-white text-[#0A192F] font-semibold px-6 py-3.5 rounded-lg hover:bg-[#FAF9F6] transition-colors"
                            >
                                {t("landing.cta_secondary")}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

const MissionCard = ({ icon: Icon, accent, title, desc, testid }) => (
    <div
        data-testid={testid}
        className="group bg-white border border-[#0A192F]/10 rounded-lg p-6 md:p-7 hover:border-[#0A192F]/30 hover:-translate-y-1 transition-all flex flex-col min-h-[240px]"
    >
        <div
            className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
            style={{
                background: `linear-gradient(135deg, ${accent}1a, ${accent}05)`,
                border: `1px solid ${accent}33`,
            }}
        >
            <Icon size={22} strokeWidth={1.5} style={{ color: accent }} />
        </div>
        <h3 className="font-serif text-xl md:text-2xl text-[#0A192F] leading-tight mb-2">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed flex-1">{desc}</p>
        <div className="mt-5 h-0.5 w-10 rounded-full" style={{ background: accent }} />
    </div>
);

const CoverageCount = ({ icon: Icon, label }) => (
    <div className="bg-white border border-[#0A192F]/10 rounded-md p-3">
        <Icon size={14} className="text-[#FF9933] mb-2" />
        <div className="font-serif text-xl text-[#0A192F]">∞</div>
        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{label}</div>
    </div>
);

const CommunityCard = ({ icon: Icon, title, desc, bg, accent, testid }) => (
    <div
        data-testid={testid}
        className="group rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg flex items-start gap-4"
        style={{ background: bg }}
    >
        <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-white/70 backdrop-blur-sm shadow-sm"
            style={{ color: accent }}
        >
            <Icon size={26} strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
            <div className="font-serif text-lg md:text-xl text-[#0A192F] leading-tight mb-1.5" style={{ color: accent }}>{title}</div>
            <div className="text-xs text-slate-700/80 leading-relaxed">{desc}</div>
        </div>
    </div>
);

const ChampionCategory = ({ icon: Icon, title, sub, fullWidth = false }) => (
    <div
        className={`group ${fullWidth ? "sm:col-span-2" : ""} flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-[#FF9933]/40 transition-colors`}
    >
        <div className="w-11 h-11 rounded-md bg-[#FF9933]/15 flex items-center justify-center shrink-0">
            <Icon size={18} className="text-[#FF9933]" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
            <div className="font-semibold text-base">{title}</div>
            <div className="text-[11px] uppercase tracking-widest text-white/40 mt-0.5">{sub}</div>
        </div>
        <ArrowRight size={14} className="text-white/30 group-hover:text-[#FF9933] group-hover:translate-x-1 transition-all" />
    </div>
);
// keep ChampionCategory export-ready for future legacy admin views
export { ChampionCategory };
