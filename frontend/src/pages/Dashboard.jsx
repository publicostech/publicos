import React, { useState } from "react";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Target, Clock, Award, ChevronDown } from "lucide-react";
import {
    STATE_LEADERBOARD, MONTHLY_TRENDS, CATEGORY_BREAKDOWN,
    DEPARTMENT_EFFICIENCY, PLATFORM_STATS,
} from "../lib/mockData";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";

const CHART_COLORS = ["#0A192F", "#FF9933", "#138808", "#3B82F6", "#8B5CF6"];

const KpiCard = ({ label, value, delta, trend, sub }) => (
    <div className="p-6 border border-[#0A192F]/10 bg-white rounded-lg" data-testid={`kpi-${label.toLowerCase().replace(/\s+/g, "-")}`}>
        <div className="overline text-slate-500 mb-3">{label}</div>
        <div className="font-serif text-4xl text-[#0A192F] tracking-tight">{value}</div>
        <div className="flex items-center gap-1.5 mt-3 text-xs font-mono">
            {trend === "up" && <TrendingUp size={13} className="text-emerald-700" />}
            {trend === "down" && <TrendingDown size={13} className="text-red-600" />}
            <span className={trend === "up" ? "text-emerald-700" : trend === "down" ? "text-red-600" : "text-slate-500"}>
                {delta}
            </span>
            <span className="text-slate-400">{sub}</span>
        </div>
    </div>
);

export default function Dashboard() {
    const [scope, setScope] = useState("country");

    return (
        <div data-testid="page-dashboard" className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
            {/* Header */}
            <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
                <div>
                    <div className="overline text-[#FF9933] mb-3">Governance Dashboard</div>
                    <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
                        The scoreboard India deserves.
                    </h1>
                    <p className="text-slate-600 mt-2 max-w-xl">
                        From pincode to parliament. Drill down. Compare. Export. All data refreshes every 60 seconds.
                    </p>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="overline text-slate-500">View</div>
                    <Select value={scope} onValueChange={setScope}>
                        <SelectTrigger className="w-44" data-testid="dashboard-scope"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="country">Country</SelectItem>
                            <SelectItem value="state">State</SelectItem>
                            <SelectItem value="district">District</SelectItem>
                            <SelectItem value="mandal">Mandal</SelectItem>
                            <SelectItem value="pincode">Pincode</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <KpiCard label="Open issues" value={`${(PLATFORM_STATS.total_reports - PLATFORM_STATS.resolved).toLocaleString()}`} delta="+12.4%" trend="up" sub="vs last month" />
                <KpiCard label="Resolution rate" value="68%" delta="+3.1%" trend="up" sub="national avg" />
                <KpiCard label="Avg closure" value="9.4d" delta="-1.2d" trend="up" sub="faster than Q4" />
                <KpiCard label="SLA breaches" value="4,218" delta="+8.9%" trend="down" sub="needs attention" />
            </div>

            {/* Trend + Category */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="lg:col-span-2 bg-white border border-[#0A192F]/10 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="overline text-slate-500 mb-1">Monthly activity</div>
                            <div className="font-serif text-xl text-[#0A192F]">Reported vs Resolved</div>
                        </div>
                        <div className="flex gap-3 text-xs">
                            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#0A192F]" /> Reported</span>
                            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#138808]" /> Resolved</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={MONTHLY_TRENDS} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: "JetBrains Mono" }} stroke="#94a3b8" />
                            <YAxis tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} stroke="#94a3b8" />
                            <Tooltip contentStyle={{ background: "#0A192F", border: "none", borderRadius: 6, color: "white", fontSize: 12 }} cursor={{ fill: "rgba(10,25,47,0.04)" }} />
                            <Bar dataKey="reported" fill="#0A192F" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="resolved" fill="#138808" radius={[2, 2, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white border border-[#0A192F]/10 rounded-lg p-6">
                    <div className="mb-4">
                        <div className="overline text-slate-500 mb-1">Category mix</div>
                        <div className="font-serif text-xl text-[#0A192F]">What citizens report</div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={CATEGORY_BREAKDOWN}
                                innerRadius={48}
                                outerRadius={78}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {CATEGORY_BREAKDOWN.map((entry, idx) => (
                                    <Cell key={idx} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: "#0A192F", border: "none", borderRadius: 6, color: "white", fontSize: 12 }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1.5 mt-4">
                        {CATEGORY_BREAKDOWN.map((c) => (
                            <div key={c.name} className="flex items-center justify-between text-xs">
                                <span className="inline-flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                                    {c.name}
                                </span>
                                <span className="font-mono text-slate-500">{c.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Leaderboard + Dept efficiency */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="bg-white border border-[#0A192F]/10 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="overline text-slate-500 mb-1 flex items-center gap-2"><Award size={12} /> State leaderboard</div>
                            <div className="font-serif text-xl text-[#0A192F]">Civic Performance Index</div>
                        </div>
                    </div>
                    <div className="space-y-2" data-testid="state-leaderboard">
                        {STATE_LEADERBOARD.slice(0, 8).map((s, i) => (
                            <div key={s.state} className="flex items-center gap-3 p-3 border border-[#0A192F]/5 rounded-md hover:bg-[#FAF9F6]">
                                <div className="font-mono text-sm text-slate-400 w-6">{String(i + 1).padStart(2, "0")}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-[#0A192F]">{s.state}</div>
                                    <div className="text-[11px] text-slate-500 font-mono">{s.resolved.toLocaleString()} resolved · {s.avg_days}d avg</div>
                                </div>
                                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${s.score}%`,
                                            background: s.score > 80 ? "#138808" : s.score > 65 ? "#FF9933" : "#dc2626",
                                        }}
                                    />
                                </div>
                                <div className="font-mono font-bold text-sm w-10 text-right text-[#0A192F]">{s.score}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-[#0A192F]/10 rounded-lg p-6">
                    <div className="mb-5">
                        <div className="overline text-slate-500 mb-1 flex items-center gap-2"><Target size={12} /> Department efficiency</div>
                        <div className="font-serif text-xl text-[#0A192F]">SLA compliance across depts</div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={DEPARTMENT_EFFICIENCY} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} stroke="#94a3b8" />
                            <YAxis type="category" dataKey="dept" tick={{ fontSize: 11 }} width={100} stroke="#64748b" />
                            <Tooltip contentStyle={{ background: "#0A192F", border: "none", borderRadius: 6, color: "white", fontSize: 12 }} cursor={{ fill: "rgba(10,25,47,0.04)" }} />
                            <Bar dataKey="sla" fill="#0A192F" radius={[0, 4, 4, 0]}>
                                {DEPARTMENT_EFFICIENCY.map((d, i) => (
                                    <Cell key={i} fill={d.sla > 85 ? "#138808" : d.sla > 75 ? "#FF9933" : "#dc2626"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* SLA trend */}
            <div className="bg-white border border-[#0A192F]/10 rounded-lg p-6 mb-6">
                <div className="mb-5">
                    <div className="overline text-slate-500 mb-1 flex items-center gap-2"><Clock size={12} /> Response time</div>
                    <div className="font-serif text-xl text-[#0A192F]">Avg resolution trend (days)</div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={MONTHLY_TRENDS.map((m, i) => ({ ...m, avg: 11 - i * 0.3 + (i % 2 ? 0.4 : -0.2) }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: "JetBrains Mono" }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} stroke="#94a3b8" />
                        <Tooltip contentStyle={{ background: "#0A192F", border: "none", borderRadius: 6, color: "white", fontSize: 12 }} />
                        <Line type="monotone" dataKey="avg" stroke="#FF9933" strokeWidth={2.5} dot={{ r: 4, fill: "#FF9933" }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Export */}
            <div className="bg-[#0A192F] text-white rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <div className="overline text-[#FF9933] mb-2">Reports & exports</div>
                    <div className="font-serif text-2xl">Download daily, weekly, or custom reports</div>
                    <div className="text-sm text-white/60 mt-1">Available as PDF, Excel, CSV · RTI-compliant formatting</div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button data-testid="export-pdf" className="bg-[#FF9933] hover:bg-white hover:text-[#0A192F] transition-colors text-white font-semibold px-4 py-2.5 rounded-md text-sm">Download PDF</button>
                    <button data-testid="export-excel" className="bg-white/10 hover:bg-white/20 font-semibold px-4 py-2.5 rounded-md text-sm">Excel</button>
                    <button data-testid="export-csv" className="bg-white/10 hover:bg-white/20 font-semibold px-4 py-2.5 rounded-md text-sm">CSV</button>
                </div>
            </div>
        </div>
    );
}
