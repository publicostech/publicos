import React, { useEffect, useState } from "react";
import { Layers, Filter, X, Locate, Loader2 } from "lucide-react";
import LeafletIssueMap from "../components/shared/LeafletIssueMap";
import { CATEGORIES, ISSUES } from "../lib/mockData";
import IssueCard from "../components/shared/IssueCard";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useLang } from "../lib/i18n";

const VIEWS_KEYS = [
    { id: "issues", k: "map.view_issues" },
    { id: "states", k: "map.view_states" },
    { id: "heat", k: "map.view_heat" },
];

// Convert backend issue → component issue shape
const fromBackend = (b) => ({
    id: b.issue_id,
    title: b.title,
    status: b.status,
    category: b.category,
    upvotes: b.upvotes,
    photos: b.photos,
    location: {
        lat: b.location?.lat,
        lng: b.location?.lng,
        city: b.location?.city,
        state: b.location?.state,
    },
});

export default function MapView() {
    const { t } = useLang();
    const [activeState, setActiveState] = useState(null);
    const [view, setView] = useState("issues");
    const [category, setCategory] = useState("all");
    const [userLoc, setUserLoc] = useState(null);
    const [realIssues, setRealIssues] = useState([]);
    const [loadingIssues, setLoadingIssues] = useState(true);

    useEffect(() => {
        let mounted = true;
        api.get("/issues", { params: { limit: 1000 } })
            .then((r) => {
                if (!mounted) return;
                const mapped = r.data.map(fromBackend).filter((i) => i.location.lat);
                // Merge with mock issues so demo locations also show clustering richness
                const merged = [...mapped, ...ISSUES.map((i) => ({ ...i, _source: "mock" }))];
                setRealIssues(merged);
            })
            .catch(() => setRealIssues(ISSUES))
            .finally(() => { if (mounted) setLoadingIssues(false); });
        return () => { mounted = false; };
    }, []);

    const stateIssues = activeState
        ? realIssues.filter((i) => i.location.state === activeState.state)
        : [];

    const locateMe = () => {
        if (!navigator.geolocation) {
            toast.error(t("map.geo_unsupported"));
            return;
        }
        toast.info(t("map.locating"));
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                toast.success(t("map.located"));
            },
            (err) => {
                toast.error(`${t("map.locate_failed")}: ${err.message}`);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return (
        <div data-testid="page-map" className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 md:py-14">
            <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
                <div>
                    <div className="overline text-[#FF9933] mb-3">{t("map.eyebrow")}</div>
                    <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
                        {t("map.title")}
                    </h1>
                    <p className="text-slate-600 mt-2 max-w-xl">
                        {t("map.subtitle")}
                    </p>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <button
                        onClick={locateMe}
                        data-testid="map-locate-me"
                        className="inline-flex items-center gap-1.5 bg-white border border-[#0A192F]/15 font-semibold text-xs px-3 py-2 rounded-md hover:border-[#0A192F]"
                    >
                        <Locate size={14} strokeWidth={1.75} /> {t("map.near_me")}
                    </button>
                    <div className="inline-flex bg-white border border-[#0A192F]/15 rounded-md p-1" data-testid="map-view-toggle">
                        {VIEWS_KEYS.map((v) => (
                            <button
                                key={v.id}
                                onClick={() => setView(v.id)}
                                className={`px-3 py-1.5 rounded text-xs font-semibold ${view === v.id ? "bg-[#0A192F] text-white" : "text-[#0A192F]"}`}
                                data-testid={`map-view-${v.id}`}
                            >
                                {t(v.k)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sidebar filter + insight */}
                <aside className="lg:col-span-3 space-y-5">
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-5">
                        <div className="overline text-slate-500 mb-3 flex items-center gap-2">
                            <Layers size={13} /> {t("map.category_layers")}
                        </div>
                        <div className="space-y-2 max-h-[260px] overflow-y-auto">
                            <button
                                onClick={() => setCategory("all")}
                                className={`w-full text-left text-sm py-1.5 px-2 rounded ${category === "all" ? "bg-[#0A192F] text-white" : "text-[#0A192F] hover:bg-slate-50"}`}
                                data-testid="map-cat-all"
                            >
                                {t("map.all_categories")}
                            </button>
                            {CATEGORIES.slice(0, 8).map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setCategory(c.id)}
                                    className={`w-full text-left text-sm py-1.5 px-2 rounded flex items-center gap-2 ${category === c.id ? "bg-[#0A192F] text-white" : "text-[#0A192F] hover:bg-slate-50"}`}
                                    data-testid={`map-cat-${c.id}`}
                                >
                                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-5">
                        <div className="overline text-slate-500 mb-3">{t("map.legend")}</div>
                        <div className="space-y-2 text-xs">
                            {[
                                { key: "submitted", color: "#64748b" },
                                { key: "under_review", color: "#3B82F6" },
                                { key: "assigned", color: "#F59E0B" },
                                { key: "in_progress", color: "#FF9933" },
                                { key: "resolved", color: "#138808" },
                                { key: "rejected", color: "#dc2626" },
                                { key: "closure_requested", color: "#d97706" },
                                { key: "closed", color: "#0A192F" },
                            ].map((s) => (
                                <div key={s.key} className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                                    {t(`status.${s.key}`)}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#0A192F] text-white rounded-lg p-5">
                        <div className="overline text-[#FF9933] mb-3">{t("map.snapshot")}</div>
                        <div className="space-y-3">
                            <Metric label={t("map.metric_open")} value={(realIssues.length || 247893).toLocaleString()} accent="text-white" />
                            <Metric label={t("map.metric_resolution")} value="68%" accent="text-emerald-400" />
                            <Metric label={t("map.metric_avg")} value={t("map.value_avg")} />
                            <Metric label={t("map.metric_hotspots")} value={t("map.value_hotspots")} accent="text-[#FF9933]" />
                        </div>
                    </div>
                </aside>

                {/* Map */}
                <div className="lg:col-span-6 bg-white border border-[#0A192F]/10 rounded-lg p-2">
                    {loadingIssues ? (
                        <div className="flex items-center justify-center" style={{ height: 620 }}>
                            <Loader2 size={28} className="animate-spin text-[#FF9933]" />
                        </div>
                    ) : (
                        <LeafletIssueMap
                            view={view}
                            categoryFilter={category}
                            onStateClick={setActiveState}
                            height={620}
                            customIssues={realIssues}
                            enableClustering={true}
                        />
                    )}
                    {userLoc && (
                        <div className="mt-2 text-[11px] font-mono text-slate-500 px-2">
                            📍 {t("map.your_location")}: {userLoc.lat.toFixed(4)}, {userLoc.lng.toFixed(4)}
                        </div>
                    )}
                </div>

                {/* Detail panel */}
                <aside className="lg:col-span-3">
                    {activeState ? (
                        <div className="bg-white border border-[#0A192F]/10 rounded-lg p-5 sticky top-24" data-testid="map-state-panel">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="overline text-[#FF9933]">{t("map.state_drill")}</div>
                                    <div className="font-serif text-2xl text-[#0A192F]">{activeState.state}</div>
                                </div>
                                <button onClick={() => setActiveState(null)} data-testid="map-close-panel">
                                    <X size={18} className="text-slate-400" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="p-3 bg-[#FAF9F6] rounded-md">
                                    <div className="overline text-slate-500 mb-1">{t("map.total_issues")}</div>
                                    <div className="font-mono text-xl font-bold text-[#0A192F]">{activeState.issues.toLocaleString()}</div>
                                </div>
                                <div className="p-3 bg-[#FAF9F6] rounded-md">
                                    <div className="overline text-slate-500 mb-1">{t("status.resolved")}</div>
                                    <div className="font-mono text-xl font-bold text-emerald-700">
                                        {Math.round((activeState.resolved / activeState.issues) * 100)}%
                                    </div>
                                </div>
                            </div>
                            <div className="overline text-slate-500 mb-2">{t("map.recent_reports")}</div>
                            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                                {stateIssues.length ? stateIssues.slice(0, 3).map((i) => (
                                    <IssueCard key={i.id} issue={i} compact />
                                )) : (
                                    <div className="text-xs text-slate-400 italic">{t("map.no_samples")}</div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#FAF9F6] border border-dashed border-[#0A192F]/20 rounded-lg p-6 sticky top-24">
                            <Filter size={22} className="text-slate-400 mb-3" strokeWidth={1.5} />
                            <div className="font-serif text-lg mb-1 text-[#0A192F]">{t("map.click_marker")}</div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                {t("map.click_marker_sub")}
                            </p>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}

const Metric = ({ label, value, accent = "text-[#FF9933]" }) => (
    <div className="flex items-baseline justify-between pb-2 border-b border-white/10 last:border-0">
        <div className="text-xs text-white/60">{label}</div>
        <div className={`font-mono font-bold ${accent}`}>{value}</div>
    </div>
);
