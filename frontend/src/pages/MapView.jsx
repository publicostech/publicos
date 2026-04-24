import React, { useState } from "react";
import { Layers, Filter, X } from "lucide-react";
import IndiaMap from "../components/shared/IndiaMap";
import { CATEGORIES, STATE_MARKERS, ISSUES } from "../lib/mockData";
import IssueCard from "../components/shared/IssueCard";

export default function MapView() {
    const [activeState, setActiveState] = useState(null);
    const [mode, setMode] = useState("density");
    const [category, setCategory] = useState("all");

    const stateIssues = activeState
        ? ISSUES.filter((i) => i.location.state === activeState.state)
        : [];

    return (
        <div data-testid="page-map" className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 md:py-14">
            <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
                <div>
                    <div className="overline text-[#FF9933] mb-3">Interactive Map</div>
                    <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
                        India, live.
                    </h1>
                    <p className="text-slate-600 mt-2 max-w-xl">
                        Markers scale with issue volume. Colour shows performance. Click any state to drill in.
                    </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <div className="inline-flex bg-white border border-[#0A192F]/15 rounded-md p-1" data-testid="map-mode-toggle">
                        <button
                            onClick={() => setMode("density")}
                            className={`px-3 py-1.5 rounded text-xs font-semibold ${mode === "density" ? "bg-[#0A192F] text-white" : "text-[#0A192F]"}`}
                            data-testid="map-mode-density"
                        >
                            Density
                        </button>
                        <button
                            onClick={() => setMode("resolved")}
                            className={`px-3 py-1.5 rounded text-xs font-semibold ${mode === "resolved" ? "bg-[#0A192F] text-white" : "text-[#0A192F]"}`}
                            data-testid="map-mode-resolved"
                        >
                            Resolution rate
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sidebar filter + insight */}
                <aside className="lg:col-span-3 space-y-5">
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-5">
                        <div className="overline text-slate-500 mb-3 flex items-center gap-2">
                            <Layers size={13} /> Category layers
                        </div>
                        <div className="space-y-2 max-h-[260px] overflow-y-auto">
                            <button
                                onClick={() => setCategory("all")}
                                className={`w-full text-left text-sm py-1.5 px-2 rounded ${category === "all" ? "bg-[#0A192F] text-white" : "text-[#0A192F] hover:bg-slate-50"}`}
                                data-testid="map-cat-all"
                            >
                                All categories
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

                    <div className="bg-[#0A192F] text-white rounded-lg p-5">
                        <div className="overline text-[#FF9933] mb-3">National Snapshot</div>
                        <div className="space-y-3">
                            <Metric label="Total open" value="247,893" accent="text-white" />
                            <Metric label="Resolution rate" value="68%" accent="text-emerald-400" />
                            <Metric label="Avg closure" value="9.4 days" />
                            <Metric label="Hotspot count" value="42 pincodes" accent="text-[#FF9933]" />
                        </div>
                    </div>
                </aside>

                {/* Map */}
                <div className="lg:col-span-6 bg-white border border-[#0A192F]/10 rounded-lg p-4 min-h-[520px] relative">
                    <IndiaMap mode={mode} onStateClick={setActiveState} activeState={activeState?.state} />
                </div>

                {/* Detail panel */}
                <aside className="lg:col-span-3">
                    {activeState ? (
                        <div className="bg-white border border-[#0A192F]/10 rounded-lg p-5 sticky top-24" data-testid="map-state-panel">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="overline text-[#FF9933]">State drill-down</div>
                                    <div className="font-serif text-2xl text-[#0A192F]">{activeState.state}</div>
                                </div>
                                <button onClick={() => setActiveState(null)} data-testid="map-close-panel">
                                    <X size={18} className="text-slate-400" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="p-3 bg-[#FAF9F6] rounded-md">
                                    <div className="overline text-slate-500 mb-1">Total issues</div>
                                    <div className="font-mono text-xl font-bold text-[#0A192F]">{activeState.issues.toLocaleString()}</div>
                                </div>
                                <div className="p-3 bg-[#FAF9F6] rounded-md">
                                    <div className="overline text-slate-500 mb-1">Resolved</div>
                                    <div className="font-mono text-xl font-bold text-emerald-700">
                                        {Math.round((activeState.resolved / activeState.issues) * 100)}%
                                    </div>
                                </div>
                            </div>
                            <div className="overline text-slate-500 mb-2">Recent reports</div>
                            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                                {stateIssues.length ? stateIssues.slice(0, 3).map((i) => (
                                    <IssueCard key={i.id} issue={i} compact />
                                )) : (
                                    <div className="text-xs text-slate-400 italic">No issues loaded for this state in demo data.</div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#FAF9F6] border border-dashed border-[#0A192F]/20 rounded-lg p-6 sticky top-24">
                            <Filter size={22} className="text-slate-400 mb-3" strokeWidth={1.5} />
                            <div className="font-serif text-lg mb-1 text-[#0A192F]">Pick a state</div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Click any marker on the map to see its latest reports, resolution rate, and drill-down options.
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
