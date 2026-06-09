import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight, ShieldCheck, Users, CheckCircle2, Eye, BarChart3,
    Construction, Lightbulb, Trash2, Droplets, AlertTriangle, TreePine, Train, MapPin,
    FileText, MessagesSquare, Activity, HandHeart, Sparkles, Award, Building2, Tractor, Landmark, Cpu,
} from "lucide-react";
import IndiaChoropleth from "../components/shared/IndiaChoropleth";
import LiveIssuePanel from "../components/shared/LiveIssuePanel";
import { CITY_HERO_IMAGES } from "../lib/mockData";
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
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center gap-6">
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
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28" data-testid="mission-section">
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

            {/* HOW IT WORKS — 4 steps */}
            <section className="bg-white border-y border-[#0A192F]/10">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
                    <div className="max-w-2xl mb-12">
                        <div className="overline text-[#FF9933] mb-3">{t("landing.loop_eyebrow")}</div>
                        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
                            {t("landing.loop_title")}
                        </h2>
                        <p className="text-slate-600 leading-relaxed mt-4 max-w-xl">
                            {t("landing.loop_sub")}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { n: "01", icon: FileText, titleKey: "landing.step1_title", textKey: "landing.step1_text" },
                            { n: "02", icon: MessagesSquare, titleKey: "landing.step2_title", textKey: "landing.step2_text" },
                            { n: "03", icon: Activity, titleKey: "landing.step3_title", textKey: "landing.step3_text" },
                            { n: "04", icon: HandHeart, titleKey: "landing.step4_title", textKey: "landing.step4_text" },
                        ].map((step) => (
                            <div
                                key={step.n}
                                data-testid={`how-step-${step.n}`}
                                className="bg-[#FAF9F6] border border-[#0A192F]/10 rounded-lg p-7 hover:border-[#0A192F]/30 hover:-translate-y-1 transition-all"
                            >
                                <div className="flex items-center justify-between mb-7">
                                    <span className="font-mono text-sm text-slate-400">{step.n}</span>
                                    <step.icon size={20} strokeWidth={1.5} className="text-[#FF9933]" />
                                </div>
                                <h3 className="font-serif text-xl mb-2 text-[#0A192F] leading-tight">
                                    {t(step.titleKey)}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{t(step.textKey)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ISSUES THAT MATTER MOST — Community Focus */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28" data-testid="topics-section">
                <div className="max-w-2xl mb-12">
                    <div className="overline text-[#FF9933] mb-3">{t("landing.topics_eyebrow")}</div>
                    <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
                        {t("landing.topics_title")}
                    </h2>
                    <p className="text-slate-600 leading-relaxed mt-4">
                        {t("landing.topics_sub")}
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {[
                        { icon: Construction, k: "topic_roads", color: "#0A192F" },
                        { icon: Lightbulb, k: "topic_lights", color: "#F59E0B" },
                        { icon: Trash2, k: "topic_waste", color: "#138808" },
                        { icon: Droplets, k: "topic_water", color: "#3B82F6" },
                        { icon: AlertTriangle, k: "topic_traffic", color: "#dc2626" },
                        { icon: MapPin, k: "topic_public_spaces", color: "#8B5CF6" },
                        { icon: TreePine, k: "topic_env", color: "#059669" },
                        { icon: Train, k: "topic_transport", color: "#FF9933" },
                    ].map((tp) => (
                        <Link
                            key={tp.k}
                            to="/feed"
                            data-testid={`topic-${tp.k}`}
                            className="group bg-white border border-[#0A192F]/10 rounded-lg p-5 hover:border-[#0A192F] hover:-translate-y-1 transition-all"
                        >
                            <div
                                className="w-11 h-11 rounded-md flex items-center justify-center mb-4"
                                style={{ background: tp.color + "12", color: tp.color }}
                            >
                                <tp.icon size={20} strokeWidth={1.5} />
                            </div>
                            <div className="font-serif text-base text-[#0A192F] leading-tight">{t(`landing.${tp.k}`)}</div>
                            <div className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold text-slate-400 group-hover:text-[#FF9933]">
                                Explore <ArrowRight size={10} />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* GROWING TOGETHER — Map */}
            <section className="bg-[#FAF9F6] border-y border-[#0A192F]/10">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
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
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28" data-testid="community-section">
                <div className="max-w-2xl mb-12">
                    <div className="overline text-[#FF9933] mb-3">{t("landing.cities_eyebrow")}</div>
                    <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
                        {t("landing.cities_title")}
                    </h2>
                    <p className="text-slate-600 leading-relaxed mt-4">
                        {t("landing.cities_sub")}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <CommunityCard
                        icon={Tractor}
                        title={t("landing.community_village_title")}
                        desc={t("landing.community_village_desc")}
                        bg={CITY_HERO_IMAGES.bangalore}
                        accent="#138808"
                        testid="community-village"
                    />
                    <CommunityCard
                        icon={Building2}
                        title={t("landing.community_town_title")}
                        desc={t("landing.community_town_desc")}
                        bg={CITY_HERO_IMAGES.delhi}
                        accent="#FF9933"
                        testid="community-town"
                    />
                    <CommunityCard
                        icon={Landmark}
                        title={t("landing.community_municipal_title")}
                        desc={t("landing.community_municipal_desc")}
                        bg={CITY_HERO_IMAGES.mumbai}
                        accent="#3B82F6"
                        testid="community-municipal"
                    />
                    <CommunityCard
                        icon={Cpu}
                        title={t("landing.community_smart_title")}
                        desc={t("landing.community_smart_desc")}
                        bg={CITY_HERO_IMAGES.bangalore}
                        accent="#8B5CF6"
                        testid="community-smart"
                    />
                </div>
            </section>

            {/* COMMUNITY CHAMPIONS — replaces leaderboard with real users */}
            <section className="bg-[#0A192F] text-white" data-testid="champions-section">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        <div className="lg:col-span-5">
                            <div className="overline text-[#FF9933] mb-3">{t("landing.champions_eyebrow")}</div>
                            <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight">
                                {t("landing.champions_title")}
                            </h2>
                            <p className="text-white/70 leading-relaxed mt-5">
                                {t("landing.champions_sub")}
                            </p>
                            <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 border border-[#FF9933]/40 rounded-full bg-[#FF9933]/10">
                                <Sparkles size={14} className="text-[#FF9933]" />
                                <span className="text-xs font-semibold text-[#FF9933] uppercase tracking-widest">Recognition launching soon</span>
                            </div>
                        </div>
                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ChampionCategory icon={Award} title={t("landing.champ_contrib")} />
                            <ChampionCategory icon={Users} title={t("landing.champ_advocates")} />
                            <ChampionCategory icon={HandHeart} title={t("landing.champ_volunteers")} />
                            <ChampionCategory icon={Sparkles} title={t("landing.champ_changemakers")} />
                            <ChampionCategory icon={Building2} title={t("landing.champ_social")} fullWidth />
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
                <div className="bg-[#FAF9F6] border border-[#0A192F]/15 rounded-lg p-10 md:p-16 text-center">
                    <CheckCircle2 size={28} strokeWidth={1.5} className="mx-auto text-emerald-700 mb-4" />
                    <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-[#0A192F] max-w-3xl mx-auto leading-tight">
                        {t("landing.cta_title")}
                    </h2>
                    <p className="text-slate-600 mt-5 max-w-2xl mx-auto leading-relaxed">
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
                            to="/register"
                            data-testid="cta-final-join"
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
        className="relative rounded-lg overflow-hidden aspect-[4/5] group cursor-pointer"
    >
        <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/60 to-[#0A192F]/10" />
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
            <div
                className="w-10 h-10 rounded-md flex items-center justify-center"
                style={{ background: accent + "33", border: `1px solid ${accent}` }}
            >
                <Icon size={18} strokeWidth={1.75} style={{ color: "white" }} />
            </div>
            <div>
                <div className="font-serif text-2xl mb-1.5 leading-tight">{title}</div>
                <div className="text-xs text-white/75 leading-relaxed">{desc}</div>
            </div>
        </div>
    </div>
);

const ChampionCategory = ({ icon: Icon, title, fullWidth = false }) => (
    <div
        className={`group ${fullWidth ? "sm:col-span-2" : ""} flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-[#FF9933]/40 transition-colors`}
    >
        <div className="w-11 h-11 rounded-md bg-[#FF9933]/15 flex items-center justify-center shrink-0">
            <Icon size={18} className="text-[#FF9933]" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
            <div className="font-semibold text-base">{title}</div>
            <div className="text-[11px] uppercase tracking-widest text-white/40 mt-0.5">Be among the first</div>
        </div>
        <ArrowRight size={14} className="text-white/30 group-hover:text-[#FF9933] group-hover:translate-x-1 transition-all" />
    </div>
);
