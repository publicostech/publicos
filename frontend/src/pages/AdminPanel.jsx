import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Users, FileCheck2, CheckCircle2, XCircle, Clock, Loader2, BarChart3, RotateCcw, Landmark, Mail, MapPin, Sparkles } from "lucide-react";
import { api, formatApiError } from "../lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { StatusBadge } from "../components/shared/StatusBadge";
import { CategoryChip } from "../components/shared/CategoryIcon";
import { toast } from "sonner";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const photoUrl = (p) => (p?.startsWith("http") ? p : `${BACKEND}${p}`);

export default function AdminPanel() {
    const [tab, setTab] = useState("queue");
    const [pendingIssues, setPendingIssues] = useState([]);
    const [closureIssues, setClosureIssues] = useState([]);
    const [allIssues, setAllIssues] = useState([]);
    const [users, setUsers] = useState([]);
    const [officials, setOfficials] = useState([]);
    const [waitlist, setWaitlist] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState("");

    const load = async () => {
        setLoading(true);
        try {
            const [pending, all, u, a, off, wl] = await Promise.all([
                api.get("/admin/issues", { params: { approval: "pending" } }).then((r) => r.data),
                api.get("/admin/issues").then((r) => r.data),
                api.get("/admin/users").then((r) => r.data),
                api.get("/admin/analytics").then((r) => r.data),
                api.get("/admin/officials").then((r) => r.data),
                api.get("/admin/waitlist").then((r) => r.data).catch(() => ({ total: 0, entries: [], by_city: [] })),
            ]);
            setPendingIssues(pending);
            setAllIssues(all);
            setClosureIssues(all.filter((i) => i.status === "closure_requested"));
            setUsers(u);
            setAnalytics(a);
            setOfficials(off);
            setWaitlist(wl);
        } catch (e) {
            toast.error(formatApiError(e));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const approve = async (id) => {
        try {
            await api.post(`/admin/issues/${id}/approve`);
            toast.success(`${id} approved and made public`);
            load();
        } catch (e) { toast.error(formatApiError(e)); }
    };
    const reject = async (id) => {
        try {
            await api.post(`/admin/issues/${id}/reject`);
            toast.success(`${id} rejected`);
            load();
        } catch (e) { toast.error(formatApiError(e)); }
    };

    const decideClosure = async (id, decision) => {
        setBusy(`${id}:${decision}`);
        try {
            await api.post(`/admin/issues/${id}/closure-decision`, { decision, remark: "" });
            toast.success(decision === "approve" ? `${id} permanently closed` : `${id} closure rejected — reopened`);
            await load();
        } catch (e) {
            toast.error(formatApiError(e));
        } finally {
            setBusy("");
        }
    };

    const promoteOfficial = async (user_id) => {
        const state = window.prompt("Assign jurisdiction — state (e.g. 'Karnataka'). Leave blank for nationwide:");
        if (state === null) return;
        const district = window.prompt("District (optional, leave blank for whole state):") || "";
        try {
            await api.post("/admin/officials/assign", { user_id, state: state.trim(), district: district.trim() });
            toast.success("User promoted to Official");
            await load();
        } catch (e) {
            toast.error(formatApiError(e));
        }
    };

    const revokeOfficial = async (user_id) => {
        try {
            await api.post("/admin/officials/revoke", { user_id });
            toast.success("Official role revoked");
            await load();
        } catch (e) {
            toast.error(formatApiError(e));
        }
    };

    return (
        <div data-testid="page-admin" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-14">
            <div className="mb-8 md:mb-10">
                <div className="overline text-[#FF9933] mb-3 flex items-center gap-2"><Shield size={13} /> Super Admin</div>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#0A192F]">Platform control room.</h1>
                <p className="text-slate-600 mt-2 max-w-xl">Approve incoming reports, monitor users and analytics, keep the public ledger clean.</p>
            </div>

            {/* KPIs */}
            {analytics && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-8">
                    <Kpi label="Total users" value={analytics.total_users} icon={Users} />
                    <Kpi label="All issues" value={analytics.total_issues} icon={FileCheck2} />
                    <Kpi label="Pending approval" value={analytics.pending_approval} icon={Clock} accent="text-amber-700" />
                    <Kpi label="Approved" value={analytics.approved} icon={CheckCircle2} accent="text-emerald-700" />
                    <Kpi label="Resolved" value={analytics.resolved} icon={BarChart3} accent="text-[#138808]" />
                </div>
            )}

            <Tabs value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="bg-white border border-[#0A192F]/10 h-auto p-1 flex-wrap">
                    <TabsTrigger value="queue" className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white px-3 sm:px-4 py-2" data-testid="admin-tab-queue">
                        Approval queue {analytics?.pending_approval > 0 && <span className="ml-1.5 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{analytics.pending_approval}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="closure" className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white px-3 sm:px-4 py-2" data-testid="admin-tab-closure">
                        Closure requests {closureIssues.length > 0 && <span className="ml-1.5 bg-amber-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{closureIssues.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="issues" className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white px-3 sm:px-4 py-2" data-testid="admin-tab-issues">All issues</TabsTrigger>
                    <TabsTrigger value="users" className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white px-3 sm:px-4 py-2" data-testid="admin-tab-users">Users</TabsTrigger>
                    <TabsTrigger value="officials" className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white px-3 sm:px-4 py-2" data-testid="admin-tab-officials">Officials</TabsTrigger>
                    <TabsTrigger value="waitlist" className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white px-3 sm:px-4 py-2" data-testid="admin-tab-waitlist">
                        Waitlist {waitlist?.total > 0 && <span className="ml-1.5 bg-[#FF9933] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{waitlist.total}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white px-3 sm:px-4 py-2" data-testid="admin-tab-analytics">Analytics</TabsTrigger>
                </TabsList>

                {/* Queue */}
                <TabsContent value="queue" className="mt-6">
                    {loading ? (
                        <div className="py-16 flex justify-center"><Loader2 size={28} className="animate-spin text-[#FF9933]" /></div>
                    ) : pendingIssues.length === 0 ? (
                        <div className="bg-white border border-dashed border-[#0A192F]/15 rounded-lg p-10 text-center" data-testid="admin-queue-empty">
                            <CheckCircle2 size={28} className="mx-auto text-emerald-600 mb-3" />
                            <div className="font-serif text-xl">No reports waiting.</div>
                            <p className="text-sm text-slate-500 mt-1">All caught up.</p>
                        </div>
                    ) : (
                        <div className="space-y-3" data-testid="admin-queue-list">
                            {pendingIssues.map((i) => (
                                <div key={i.issue_id} className="bg-white border border-[#0A192F]/10 rounded-lg p-4 md:p-5" data-testid={`admin-queue-${i.issue_id}`}>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        {i.photos?.[0] && <img src={photoUrl(i.photos[0])} className="w-full md:w-32 h-32 md:h-24 object-cover rounded-md shrink-0" alt="" />}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                                <CategoryChip categoryId={i.category} />
                                                <StatusBadge status={i.status} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">Pending</span>
                                                <span className="font-mono text-[10px] text-slate-400 ml-auto">#{i.issue_id}</span>
                                            </div>
                                            <Link to={`/issue/${i.issue_id}`} className="font-serif text-lg text-[#0A192F] hover:text-[#FF9933] block mb-2">{i.title}</Link>
                                            <p className="text-sm text-slate-600 line-clamp-2 mb-2">{i.description}</p>
                                            <div className="text-xs text-slate-500">
                                                {i.reporter?.name} · {i.location?.city}, {i.location?.state} · {new Date(i.posted_at).toLocaleString("en-IN", { dateStyle: "medium" })}
                                            </div>
                                        </div>
                                        <div className="flex md:flex-col gap-2 shrink-0">
                                            <button onClick={() => approve(i.issue_id)} data-testid={`admin-approve-${i.issue_id}`} className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-emerald-600 text-white font-semibold px-3 py-2 rounded-md text-xs hover:bg-emerald-700">
                                                <CheckCircle2 size={14} /> Approve
                                            </button>
                                            <button onClick={() => reject(i.issue_id)} data-testid={`admin-reject-${i.issue_id}`} className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-white border border-red-200 text-red-700 font-semibold px-3 py-2 rounded-md text-xs hover:bg-red-50">
                                                <XCircle size={14} /> Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Closure requests */}
                <TabsContent value="closure" className="mt-6">
                    {closureIssues.length === 0 ? (
                        <div className="bg-white border border-dashed border-[#0A192F]/15 rounded-lg p-10 text-center" data-testid="closure-empty">
                            <CheckCircle2 size={28} className="mx-auto text-emerald-600 mb-3" />
                            <div className="font-serif text-xl">No closure requests pending.</div>
                            <p className="text-sm text-slate-500 mt-1">Citizens haven&apos;t requested any closures.</p>
                        </div>
                    ) : (
                        <div className="space-y-3" data-testid="closure-list">
                            {closureIssues.map((i) => (
                                <div key={i.issue_id} className="bg-white border border-amber-200 rounded-lg p-4 md:p-5" data-testid={`closure-row-${i.issue_id}`}>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        {i.photos?.[0] && <img src={photoUrl(i.photos[0])} className="w-full md:w-32 h-32 md:h-24 object-cover rounded-md shrink-0" alt="" />}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                                <CategoryChip categoryId={i.category} />
                                                <StatusBadge status={i.status} />
                                                <span className="font-mono text-[10px] text-slate-400 ml-auto">#{i.issue_id}</span>
                                            </div>
                                            <Link to={`/issue/${i.issue_id}`} className="font-serif text-lg text-[#0A192F] hover:text-[#FF9933] block mb-1">{i.title}</Link>
                                            {i.closure?.comment && (
                                                <p className="text-sm text-slate-700 italic line-clamp-2">&ldquo;{i.closure.comment}&rdquo;</p>
                                            )}
                                            <div className="text-xs text-slate-500 mt-2">
                                                {i.closure?.requested_by_name || i.reporter?.name} · {i.location?.city}, {i.location?.state} · Requested {i.closure?.requested_at ? new Date(i.closure.requested_at).toLocaleString("en-IN", { dateStyle: "medium" }) : ""}
                                            </div>
                                        </div>
                                        <div className="flex md:flex-col gap-2 shrink-0">
                                            <button
                                                onClick={() => decideClosure(i.issue_id, "approve")}
                                                disabled={busy === `${i.issue_id}:approve`}
                                                data-testid={`closure-approve-${i.issue_id}`}
                                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-emerald-600 text-white font-semibold px-3 py-2 rounded-md text-xs hover:bg-emerald-700 disabled:opacity-60"
                                            >
                                                {busy === `${i.issue_id}:approve` ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={14} />} Approve
                                            </button>
                                            <button
                                                onClick={() => decideClosure(i.issue_id, "reject")}
                                                disabled={busy === `${i.issue_id}:reject`}
                                                data-testid={`closure-reject-${i.issue_id}`}
                                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-white border border-red-200 text-red-700 font-semibold px-3 py-2 rounded-md text-xs hover:bg-red-50 disabled:opacity-60"
                                            >
                                                {busy === `${i.issue_id}:reject` ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={14} />} Reopen
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="issues" className="mt-6">
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-[#FAF9F6] border-b border-[#0A192F]/10">
                                    <tr className="text-xs uppercase tracking-widest text-slate-500">
                                        <th className="text-left p-3 sm:p-4">ID</th>
                                        <th className="text-left p-3 sm:p-4">Title</th>
                                        <th className="text-left p-3 sm:p-4">Status</th>
                                        <th className="text-left p-3 sm:p-4">Approval</th>
                                        <th className="text-left p-3 sm:p-4">Reporter</th>
                                        <th className="text-left p-3 sm:p-4">When</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allIssues.map((i) => (
                                        <tr key={i.issue_id} className="border-b border-[#0A192F]/5 hover:bg-[#FAF9F6]">
                                            <td className="p-3 sm:p-4 font-mono text-xs">{i.issue_id}</td>
                                            <td className="p-3 sm:p-4"><Link to={`/issue/${i.issue_id}`} className="hover:text-[#FF9933] font-semibold line-clamp-1">{i.title}</Link></td>
                                            <td className="p-3 sm:p-4"><StatusBadge status={i.status} /></td>
                                            <td className="p-3 sm:p-4">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                                    i.approval_status === "approved" ? "bg-emerald-50 text-emerald-700" :
                                                    i.approval_status === "rejected" ? "bg-red-50 text-red-700" :
                                                    "bg-amber-50 text-amber-700"
                                                }`}>{i.approval_status}</span>
                                            </td>
                                            <td className="p-3 sm:p-4 text-xs">{i.reporter?.name}</td>
                                            <td className="p-3 sm:p-4 text-xs text-slate-500">{new Date(i.posted_at).toLocaleDateString("en-IN")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabsContent>

                {/* Users */}
                <TabsContent value="users" className="mt-6">
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm" data-testid="admin-users-table">
                                <thead className="bg-[#FAF9F6] border-b border-[#0A192F]/10">
                                    <tr className="text-xs uppercase tracking-widest text-slate-500">
                                        <th className="text-left p-3 sm:p-4">Name</th>
                                        <th className="text-left p-3 sm:p-4">Email</th>
                                        <th className="text-left p-3 sm:p-4">Role</th>
                                        <th className="text-left p-3 sm:p-4">Auth</th>
                                        <th className="text-left p-3 sm:p-4">Joined</th>
                                        <th className="text-right p-3 sm:p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.user_id} className="border-b border-[#0A192F]/5 hover:bg-[#FAF9F6]">
                                            <td className="p-3 sm:p-4 font-semibold">{u.name}</td>
                                            <td className="p-3 sm:p-4 text-xs">{u.email}</td>
                                            <td className="p-3 sm:p-4">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${u.role === "admin" ? "bg-[#0A192F] text-white" : u.role === "official" ? "bg-[#138808] text-white" : "bg-slate-100 text-slate-700"}`}>{u.role}</span>
                                            </td>
                                            <td className="p-3 sm:p-4 text-xs">{u.auth_provider}</td>
                                            <td className="p-3 sm:p-4 text-xs text-slate-500">{new Date(u.created_at).toLocaleDateString("en-IN")}</td>
                                            <td className="p-3 sm:p-4 text-right">
                                                {u.role === "citizen" ? (
                                                    <button onClick={() => promoteOfficial(u.user_id)} data-testid={`promote-${u.user_id}`} className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-amber-100 text-amber-800 hover:bg-amber-200">Make official</button>
                                                ) : u.role === "official" ? (
                                                    <button onClick={() => revokeOfficial(u.user_id)} data-testid={`revoke-${u.user_id}`} className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200">Revoke</button>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabsContent>

                {/* Officials */}
                <TabsContent value="officials" className="mt-6">
                    {officials.length === 0 ? (
                        <div className="bg-white border border-dashed border-[#0A192F]/15 rounded-lg p-10 text-center" data-testid="officials-empty">
                            <Landmark size={28} className="mx-auto text-slate-400 mb-3" />
                            <div className="font-serif text-xl">No officials assigned yet.</div>
                            <p className="text-sm text-slate-500 mt-1">Promote any citizen from the Users tab and assign a jurisdiction (state / district).</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-[#0A192F]/10 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm" data-testid="officials-table">
                                    <thead className="bg-[#FAF9F6] border-b border-[#0A192F]/10">
                                        <tr className="text-xs uppercase tracking-widest text-slate-500">
                                            <th className="text-left p-3 sm:p-4">Name</th>
                                            <th className="text-left p-3 sm:p-4">Email</th>
                                            <th className="text-left p-3 sm:p-4">State</th>
                                            <th className="text-left p-3 sm:p-4">District</th>
                                            <th className="text-right p-3 sm:p-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {officials.map((o) => (
                                            <tr key={o.user_id} className="border-b border-[#0A192F]/5 hover:bg-[#FAF9F6]">
                                                <td className="p-3 sm:p-4 font-semibold">{o.name}</td>
                                                <td className="p-3 sm:p-4 text-xs">{o.email}</td>
                                                <td className="p-3 sm:p-4 text-xs">{o.jurisdiction?.state || <span className="text-slate-400">All India</span>}</td>
                                                <td className="p-3 sm:p-4 text-xs">{o.jurisdiction?.district || <span className="text-slate-400">All</span>}</td>
                                                <td className="p-3 sm:p-4 text-right">
                                                    <button onClick={() => revokeOfficial(o.user_id)} data-testid={`official-revoke-${o.user_id}`} className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200">Revoke</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Waitlist */}
                <TabsContent value="waitlist" className="mt-6">
                    {!waitlist || waitlist.total === 0 ? (
                        <div className="bg-white border border-dashed border-[#0A192F]/15 rounded-lg p-10 text-center" data-testid="waitlist-empty">
                            <Mail size={28} className="mx-auto text-slate-400 mb-3" />
                            <div className="font-serif text-xl">No waitlist signups yet.</div>
                            <p className="text-sm text-slate-500 mt-1">As founding citizens join from the landing page, they&apos;ll appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="bg-white border border-[#0A192F]/10 rounded-lg p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles size={14} className="text-[#FF9933]" />
                                        <div className="overline text-slate-500">Total signups</div>
                                    </div>
                                    <div className="font-serif text-4xl tracking-tight text-[#0A192F]" data-testid="waitlist-total">{waitlist.total.toLocaleString()}</div>
                                </div>
                                <div className="md:col-span-2 bg-white border border-[#0A192F]/10 rounded-lg p-5">
                                    <div className="overline text-slate-500 mb-3">Top cities by demand</div>
                                    <div className="flex flex-wrap gap-2">
                                        {waitlist.by_city.slice(0, 10).map((c) => (
                                            <div key={c.city} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAF9F6] border border-[#0A192F]/10 rounded-full text-xs" data-testid={`waitlist-city-${c.city}`}>
                                                <MapPin size={11} className="text-[#FF9933]" />
                                                <span className="text-[#0A192F] font-semibold">{c.city}</span>
                                                <span className="font-mono text-slate-500">{c.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border border-[#0A192F]/10 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm" data-testid="waitlist-table">
                                        <thead className="bg-[#FAF9F6] border-b border-[#0A192F]/10">
                                            <tr className="text-xs uppercase tracking-widest text-slate-500">
                                                <th className="text-left p-3 sm:p-4">#</th>
                                                <th className="text-left p-3 sm:p-4">Email</th>
                                                <th className="text-left p-3 sm:p-4">City</th>
                                                <th className="text-left p-3 sm:p-4">Source</th>
                                                <th className="text-left p-3 sm:p-4">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {waitlist.entries.map((w) => (
                                                <tr key={w.email} className="border-b border-[#0A192F]/5 hover:bg-[#FAF9F6]">
                                                    <td className="p-3 sm:p-4 font-mono text-xs text-[#FF9933]">#{w.position}</td>
                                                    <td className="p-3 sm:p-4 font-mono text-xs">{w.email}</td>
                                                    <td className="p-3 sm:p-4 text-sm">{w.city}</td>
                                                    <td className="p-3 sm:p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">{w.source}</td>
                                                    <td className="p-3 sm:p-4 text-xs text-slate-500">{new Date(w.joined_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Analytics */}
                <TabsContent value="analytics" className="mt-6">
                    {analytics && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white border border-[#0A192F]/10 rounded-lg p-5">
                                <div className="overline text-slate-500 mb-3">By category</div>
                                <div className="space-y-2">
                                    {analytics.by_category.map((c) => (
                                        <div key={c.category} className="flex items-center gap-3">
                                            <span className="text-sm font-semibold flex-1 capitalize">{c.category}</span>
                                            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#FF9933]" style={{ width: `${Math.min(100, (c.count / Math.max(...analytics.by_category.map((x) => x.count))) * 100)}%` }} />
                                            </div>
                                            <span className="font-mono text-sm w-10 text-right">{c.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white border border-[#0A192F]/10 rounded-lg p-5">
                                <div className="overline text-slate-500 mb-3">By state</div>
                                <div className="space-y-2">
                                    {analytics.by_state.map((s) => (
                                        <div key={s.state} className="flex items-center gap-3">
                                            <span className="text-sm font-semibold flex-1">{s.state}</span>
                                            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#138808]" style={{ width: `${Math.min(100, (s.count / Math.max(...analytics.by_state.map((x) => x.count))) * 100)}%` }} />
                                            </div>
                                            <span className="font-mono text-sm w-10 text-right">{s.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

const Kpi = ({ label, value, icon: Icon, accent = "text-[#0A192F]" }) => (
    <div className="p-4 sm:p-5 border border-[#0A192F]/10 bg-white rounded-lg" data-testid={`kpi-${label.toLowerCase().replace(/\s+/g, "-")}`}>
        <div className="flex items-start justify-between mb-2">
            <div className="overline text-slate-500">{label}</div>
            <Icon size={14} className={accent} />
        </div>
        <div className={`font-serif text-2xl md:text-3xl tracking-tight ${accent}`}>{value}</div>
    </div>
);
