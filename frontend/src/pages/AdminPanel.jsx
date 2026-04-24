import React from "react";
import { Shield, AlertTriangle, Users, Tag, Layers, FileCheck2, XCircle, CheckCircle2 } from "lucide-react";
import { MODERATION_QUEUE, CATEGORIES, STATES } from "../lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";

export default function AdminPanel() {
    return (
        <div data-testid="page-admin" className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
            <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
                <div>
                    <div className="overline text-[#FF9933] mb-3 flex items-center gap-2"><Shield size={13} /> Super Admin</div>
                    <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">Platform control room.</h1>
                    <p className="text-slate-600 mt-2 max-w-xl">Moderate, verify, configure. Every admin action is logged and auditable.</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <AdminKpi label="Active users" value="1.84M" sub="+42K this week" icon={Users} />
                <AdminKpi label="Pending moderation" value="51" sub="3 high severity" icon={AlertTriangle} accent="text-red-600" />
                <AdminKpi label="Verified officials" value="12,480" sub="across 28 states" icon={CheckCircle2} accent="text-emerald-700" />
                <AdminKpi label="Categories live" value={CATEGORIES.length} sub="13 civic types" icon={Tag} />
            </div>

            <Tabs defaultValue="moderation" className="w-full">
                <TabsList className="bg-white border border-[#0A192F]/10 h-auto p-1 flex-wrap">
                    <TabsTrigger value="moderation" className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white px-4 py-2" data-testid="admin-tab-mod">Moderation</TabsTrigger>
                    <TabsTrigger value="users" className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white px-4 py-2" data-testid="admin-tab-users">Users</TabsTrigger>
                    <TabsTrigger value="departments" className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white px-4 py-2" data-testid="admin-tab-depts">Departments</TabsTrigger>
                    <TabsTrigger value="categories" className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white px-4 py-2" data-testid="admin-tab-cats">Categories</TabsTrigger>
                    <TabsTrigger value="geography" className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white px-4 py-2" data-testid="admin-tab-geo">Geography</TabsTrigger>
                </TabsList>

                {/* Moderation */}
                <TabsContent value="moderation" className="mt-6">
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg overflow-hidden">
                        <div className="p-5 border-b border-[#0A192F]/10 flex items-center justify-between">
                            <div>
                                <div className="font-serif text-xl">Moderation queue</div>
                                <div className="text-xs text-slate-500">Flagged by citizens or AI — review within 24h</div>
                            </div>
                            <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-1 rounded-md">
                                {MODERATION_QUEUE.length} pending
                            </span>
                        </div>
                        <table className="w-full text-sm" data-testid="moderation-table">
                            <thead className="bg-[#FAF9F6] border-b border-[#0A192F]/10">
                                <tr className="text-xs uppercase tracking-widest text-slate-500">
                                    <th className="text-left p-4">ID</th>
                                    <th className="text-left p-4">Type</th>
                                    <th className="text-left p-4">Issue</th>
                                    <th className="text-left p-4">Reports</th>
                                    <th className="text-left p-4">Severity</th>
                                    <th className="text-right p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MODERATION_QUEUE.map((m) => (
                                    <tr key={m.id} className="border-b border-[#0A192F]/5 last:border-0 hover:bg-[#FAF9F6]" data-testid={`mod-row-${m.id}`}>
                                        <td className="p-4 font-mono text-xs text-slate-500">{m.id}</td>
                                        <td className="p-4 font-semibold">{m.type}</td>
                                        <td className="p-4 text-slate-700">{m.issue}</td>
                                        <td className="p-4 font-mono">{m.reports}</td>
                                        <td className="p-4">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                                m.severity === "High" ? "bg-red-50 text-red-700 border border-red-200" :
                                                m.severity === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                                "bg-slate-100 text-slate-700 border border-slate-200"
                                            }`}>{m.severity}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex gap-1 justify-end">
                                                <button onClick={() => toast.success(`${m.id} approved`)} className="p-1.5 rounded hover:bg-emerald-50 text-emerald-700" data-testid={`mod-approve-${m.id}`}>
                                                    <CheckCircle2 size={16} />
                                                </button>
                                                <button onClick={() => toast.error(`${m.id} removed`)} className="p-1.5 rounded hover:bg-red-50 text-red-700" data-testid={`mod-reject-${m.id}`}>
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>

                {/* Users */}
                <TabsContent value="users" className="mt-6">
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-6">
                        <div className="font-serif text-xl mb-4">User management</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { k: "Citizens", v: "1,840,927" },
                                { k: "Officials", v: "12,480" },
                                { k: "Banned", v: "342" },
                            ].map((s) => (
                                <div key={s.k} className="p-5 bg-[#FAF9F6] border border-[#0A192F]/5 rounded-md">
                                    <div className="overline text-slate-500 mb-2">{s.k}</div>
                                    <div className="font-mono font-bold text-2xl text-[#0A192F]">{s.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Departments */}
                <TabsContent value="departments" className="mt-6">
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-6">
                        <div className="font-serif text-xl mb-4">Departments</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {["BBMP Roads", "HMWSSB", "MCG Sanitation", "Delhi Traffic Police", "KSPCB", "GCC Electrical", "BMC Enforcement", "District Health Office", "Vigilance Wing"].map((d) => (
                                <div key={d} className="flex items-center justify-between p-4 border border-[#0A192F]/10 rounded-md hover:border-[#0A192F]">
                                    <div>
                                        <div className="font-semibold text-sm text-[#0A192F]">{d}</div>
                                        <div className="text-xs text-slate-500 font-mono">{Math.floor(Math.random() * 20 + 5)} officers</div>
                                    </div>
                                    <button className="text-xs text-[#FF9933] font-semibold">Configure</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Categories */}
                <TabsContent value="categories" className="mt-6">
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-6">
                        <div className="font-serif text-xl mb-4">Civic issue categories</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {CATEGORIES.map((c) => (
                                <div key={c.id} className="flex items-center gap-3 p-4 border border-[#0A192F]/10 rounded-md">
                                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: c.color }} />
                                    <span className="font-semibold text-sm text-[#0A192F]">{c.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Geography */}
                <TabsContent value="geography" className="mt-6">
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-6">
                        <div className="font-serif text-xl mb-4 flex items-center gap-2"><Layers size={18} /> Geographic hierarchy</div>
                        <p className="text-sm text-slate-600 mb-5">Country → 28 States → 612 Districts → Mandals/Taluks → Wards → Pincodes</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            {STATES.map((s) => (
                                <div key={s} className="p-3 border border-[#0A192F]/10 rounded-md text-xs font-semibold text-center hover:border-[#FF9933] hover:text-[#FF9933] cursor-pointer">
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

const AdminKpi = ({ label, value, sub, icon: Icon, accent = "text-[#0A192F]" }) => (
    <div className="p-5 border border-[#0A192F]/10 bg-white rounded-lg" data-testid={`admin-kpi-${label.toLowerCase().replace(/\s+/g, "-")}`}>
        <div className="flex items-start justify-between mb-3">
            <div className="overline text-slate-500">{label}</div>
            <Icon size={16} className={accent} strokeWidth={1.5} />
        </div>
        <div className={`font-serif text-3xl tracking-tight ${accent}`}>{value}</div>
        <div className="text-xs text-slate-500 font-mono mt-1">{sub}</div>
    </div>
);
