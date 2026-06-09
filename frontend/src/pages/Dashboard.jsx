import React from "react";
import { Link } from "react-router-dom";
import {
    BarChart3, Map as MapIcon, TrendingUp, Award, Users, Clock,
    ArrowRight, Sparkles, Zap, Shield, Globe2,
} from "lucide-react";
import { useLang } from "../lib/i18n";

export default function Dashboard() {
    const { t } = useLang();
    return (
        <div data-testid="page-dashboard" className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 py-10 md:py-16">
            {/* Pre-launch banner */}
            <div className="mb-8 md:mb-12 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full" data-testid="dashboard-prelaunch-banner">
                <Sparkles size={13} className="text-amber-700" />
                <span className="overline text-amber-800">Pre-launch · Data populating soon</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 mb-10 md:mb-14">
                <div className="lg:col-span-7">
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#0A192F] leading-tight mb-3 md:mb-4">
                        Public dashboards <span className="italic text-[#FF9933]">arrive with our first city.</span>
                    </h1>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base max-w-xl">
                        Every PublicOS dashboard is built to render real, verified civic data — no fake counters, no manufactured metrics. As soon as the first community goes live, this page will breathe with live state-wise reports, response times, and resolution scores. Until then, here&apos;s what&apos;s coming.
                    </p>
                </div>
                <div className="lg:col-span-5">
                    <div
                        className="relative rounded-2xl p-6 overflow-hidden text-white"
                        style={{ background: "linear-gradient(135deg, #0A192F 0%, #1a3358 100%)" }}
                    >
                        <div className="overline text-[#FF9933] mb-3">Our promise</div>
                        <div className="font-serif text-xl md:text-2xl leading-tight mb-3">
                            Only real numbers go on the public ledger.
                        </div>
                        <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                            Every chart here will source from verified citizen reports and officially-acknowledged actions. No estimates. No projections. No PR spin.
                        </p>
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full blur-3xl bg-[#FF9933]/40" />
                    </div>
                </div>
            </div>

            {/* Coming-soon panels grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5" data-testid="dashboard-panels">
                <ComingPanel
                    icon={BarChart3}
                    title="National pulse"
                    desc="Total open / resolved / in-progress reports across India — refreshed live."
                    bg="#FFEAD9" accent="#FF6B35"
                    eta="Goes live with launch city #1"
                    testid="panel-pulse"
                />
                <ComingPanel
                    icon={MapIcon}
                    title="State leaderboard"
                    desc="Resolution rate, average days-to-close, citizen satisfaction — ranked by state."
                    bg="#DAEFFB" accent="#3B82F6"
                    eta="Once 5+ states have active reports"
                    testid="panel-leaderboard"
                />
                <ComingPanel
                    icon={TrendingUp}
                    title="Category trends"
                    desc="Which civic concerns are rising fastest, broken down by month + region."
                    bg="#D4F5E1" accent="#10B981"
                    eta="After 3 months of live data"
                    testid="panel-trends"
                />
                <ComingPanel
                    icon={Award}
                    title="Department report card"
                    desc="Per-department SLA performance — who responds fast, who needs follow-up."
                    bg="#E8DCFB" accent="#8B5CF6"
                    eta="Once officials are onboarded in your city"
                    testid="panel-departments"
                />
                <ComingPanel
                    icon={Users}
                    title="Founding citizens map"
                    desc="See where the movement is growing — waitlist density by city + state."
                    bg="#FFF4CC" accent="#F59E0B"
                    eta="Visible to admins today · public at 1,000 signups"
                    testid="panel-citizens"
                />
                <ComingPanel
                    icon={Clock}
                    title="Response-time heatmap"
                    desc="Average time from report → first acknowledgement → resolution, by pincode."
                    bg="#FFE0E0" accent="#EF4444"
                    eta="Goes live with launch city #1"
                    testid="panel-response"
                />
            </div>

            {/* Why this matters */}
            <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <PillarStrip
                    icon={Shield}
                    title="Transparent by default"
                    desc="Every number on these dashboards links back to the raw reports that generated it."
                    accent="#10B981"
                />
                <PillarStrip
                    icon={Zap}
                    title="Real-time, not retrospective"
                    desc="Charts update the moment officials act — no end-of-month manual rollups."
                    accent="#FF6B35"
                />
                <PillarStrip
                    icon={Globe2}
                    title="Public, downloadable, auditable"
                    desc="Journalists, researchers, and citizens can export raw data anytime."
                    accent="#3B82F6"
                />
            </div>

            {/* CTA */}
            <div className="mt-12 md:mt-16 bg-[#FAF9F6] border border-[#0A192F]/10 rounded-2xl p-6 md:p-10 text-center" data-testid="dashboard-cta">
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#0A192F] tracking-tight mb-3">
                    Want these dashboards live in your city?
                </h2>
                <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto mb-6">
                    The faster a city&apos;s waitlist grows, the sooner PublicOS launches there. Join the founding-citizens list and pull your community to the front of the queue.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                    <Link
                        to="/#waitlist"
                        onClick={(e) => { e.preventDefault(); document.querySelector("[data-testid='waitlist-section']")?.scrollIntoView({ behavior: "smooth" }); }}
                        className="inline-flex items-center gap-2 bg-[#0A192F] text-white font-semibold px-5 py-3 rounded-lg hover:bg-[#FF9933] transition-colors"
                        data-testid="dashboard-waitlist-cta"
                    >
                        Join the waitlist <ArrowRight size={14} />
                    </Link>
                    <Link
                        to="/feed"
                        className="inline-flex items-center gap-2 bg-white border border-[#0A192F]/15 text-[#0A192F] font-semibold px-5 py-3 rounded-lg hover:border-[#0A192F]"
                    >
                        Explore the public feed
                    </Link>
                </div>
            </div>
        </div>
    );
}

const ComingPanel = ({ icon: Icon, title, desc, bg, accent, eta, testid }) => (
    <div
        data-testid={testid}
        className="relative rounded-2xl p-5 md:p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-md flex flex-col min-h-[220px]"
        style={{ background: bg }}
    >
        <div className="flex items-start justify-between mb-5">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/70 backdrop-blur-sm shadow-sm"
                style={{ color: accent }}
            >
                <Icon size={22} strokeWidth={1.75} />
            </div>
            <span
                className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-white/80 border"
                style={{ color: accent, borderColor: accent + "55" }}
                data-testid={`${testid}-coming-soon`}
            >
                Coming soon
            </span>
        </div>
        <div className="font-serif text-lg md:text-xl text-[#0A192F] leading-tight mb-2">{title}</div>
        <p className="text-xs md:text-sm text-slate-700/80 leading-relaxed flex-1">{desc}</p>
        <div className="mt-4 pt-3 border-t border-[#0A192F]/10 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5" style={{ color: accent }}>
            <Sparkles size={11} /> {eta}
        </div>
    </div>
);

const PillarStrip = ({ icon: Icon, title, desc, accent }) => (
    <div className="bg-white border border-[#0A192F]/10 rounded-xl p-5">
        <div
            className="w-10 h-10 rounded-md flex items-center justify-center mb-3"
            style={{ background: accent + "12", color: accent }}
        >
            <Icon size={18} strokeWidth={1.75} />
        </div>
        <div className="font-serif text-base text-[#0A192F] mb-1.5">{title}</div>
        <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
    </div>
);
