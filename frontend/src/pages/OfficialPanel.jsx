import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Landmark, Clock, AlertCircle, CheckCircle2, MessageSquare, Loader2, RotateCcw } from "lucide-react";
import { api, formatApiError } from "../lib/api";
import { useAuth } from "../lib/auth";
import { StatusBadge } from "../components/shared/StatusBadge";
import { CategoryIcon, CategoryChip } from "../components/shared/CategoryIcon";
import { toast } from "sonner";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const photoUrl = (p) => (p?.startsWith("http") ? p : `${BACKEND}${p}`);

export default function OfficialPanel() {
    const { user, loading: authLoading } = useAuth();
    const nav = useNavigate();
    const [meta, setMeta] = useState(null);
    const [issues, setIssues] = useState([]);
    const [selected, setSelected] = useState(null);
    const [newStatus, setNewStatus] = useState("under_review");
    const [remark, setRemark] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState("");
    const [decisionBusy, setDecisionBusy] = useState("");

    useEffect(() => {
        if (authLoading) return;
        if (!user) { nav("/login"); return; }
        if (user.role !== "official" && user.role !== "admin") { nav("/me"); return; }
        load();
    }, [authLoading, user, nav]); // eslint-disable-line

    const load = async () => {
        setLoading(true);
        try {
            const [m, list] = await Promise.all([
                api.get("/official/me").then((r) => r.data),
                api.get("/official/issues").then((r) => r.data),
            ]);
            setMeta(m);
            setIssues(list);
            if (list.length && !selected) {
                setSelected(list[0]);
                setNewStatus(list[0].status);
            }
        } catch (e) {
            toast.error(formatApiError(e));
        } finally {
            setLoading(false);
        }
    };

    const filterIssues = (list, mode) => {
        if (mode === "critical") return list.filter((i) => i.urgency === "critical");
        if (mode === "closure") return list.filter((i) => i.status === "closure_requested");
        if (mode === "active") return list.filter((i) => ["submitted", "under_review", "assigned", "in_progress"].includes(i.status));
        return list;
    };
    const filtered = filterIssues(issues, filter);

    const select = (i) => {
        setSelected(i);
        setNewStatus(i.status === "closure_requested" ? (i.previous_status || "in_progress") : i.status);
        setRemark("");
    };

    const handleUpdate = async () => {
        if (!selected) return;
        setBusy("update");
        try {
            await api.post(`/official/issues/${selected.issue_id}/status`, { status: newStatus, remark });
            toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
            setRemark("");
            await load();
            const refreshed = await api.get(`/issues/${selected.issue_id}`).then((r) => r.data);
            setSelected(refreshed);
        } catch (e) {
            toast.error(formatApiError(e));
        } finally {
            setBusy("");
        }
    };

    const decideClosure = async (decision) => {
        if (!selected) return;
        setDecisionBusy(decision);
        try {
            await api.post(`/admin/issues/${selected.issue_id}/closure-decision`, { decision, remark });
            toast.success(decision === "approve" ? "Issue closed" : "Closure rejected — issue reopened");
            setRemark("");
            await load();
            const refreshed = await api.get(`/issues/${selected.issue_id}`).then((r) => r.data);
            setSelected(refreshed);
        } catch (e) {
            toast.error(formatApiError(e));
        } finally {
            setDecisionBusy("");
        }
    };

    if (loading || authLoading) {
        return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 size={28} className="animate-spin text-[#FF9933]" /></div>;
    }

    const j = meta?.jurisdiction || {};
    const jurisdictionLabel = [j.district, j.state].filter(Boolean).join(", ") || (user?.role === "admin" ? "All India (Admin)" : "Nationwide");

    return (
        <div data-testid="page-official" className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-14">
            <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-[#0A192F] flex items-center justify-center text-white">
                        <Landmark size={24} />
                    </div>
                    <div>
                        <div className="overline text-[#FF9933] mb-1">Official Portal</div>
                        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-tight text-[#0A192F]">
                            {user?.name} <span className="text-slate-400 font-normal text-lg sm:text-xl md:text-2xl">· {jurisdictionLabel}</span>
                        </h1>
                    </div>
                </div>
                <div className="flex gap-4 sm:gap-6 text-right">
                    <Kpi num={meta?.stats?.pending_closure ?? 0} label="Closure pending" accent="text-amber-700" />
                    <Kpi num={meta?.stats?.open ?? 0} label="Open" />
                    <Kpi num={meta?.stats?.resolved ?? 0} label="Resolved" accent="text-emerald-700" />
                </div>
            </div>

            {issues.length === 0 ? (
                <div className="bg-white border border-dashed border-[#0A192F]/15 rounded-lg p-10 text-center" data-testid="official-empty">
                    <Landmark size={28} className="mx-auto text-slate-400 mb-3" />
                    <div className="font-serif text-xl">Nothing in your queue yet.</div>
                    <p className="text-sm text-slate-500 mt-1">Once citizens report issues in {jurisdictionLabel}, they&apos;ll appear here.</p>
                </div>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Queue */}
                <div className="lg:col-span-5">
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg overflow-hidden">
                        <div className="p-5 border-b border-[#0A192F]/10 flex items-center justify-between">
                            <div>
                                <div className="font-serif text-xl">My queue</div>
                                <div className="text-xs text-slate-500">{filtered.length} issue{filtered.length === 1 ? "" : "s"}</div>
                            </div>
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="w-36" data-testid="official-filter"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="critical">Critical only</SelectItem>
                                    <SelectItem value="closure">Closure pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="divide-y divide-[#0A192F]/5 max-h-[640px] overflow-y-auto" data-testid="official-queue">
                            {filtered.map((i) => (
                                <button
                                    key={i.issue_id}
                                    onClick={() => select(i)}
                                    className={`w-full text-left p-4 flex gap-3 hover:bg-[#FAF9F6] transition-colors ${selected?.issue_id === i.issue_id ? "bg-[#FAF9F6] border-l-4 border-[#FF9933]" : "border-l-4 border-transparent"}`}
                                    data-testid={`official-queue-item-${i.issue_id}`}
                                >
                                    <div className="w-10 h-10 rounded-md bg-[#FAF9F6] flex items-center justify-center shrink-0">
                                        <CategoryIcon categoryId={i.category} size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-[10px] text-slate-400">#{i.issue_id}</span>
                                            {i.urgency === "critical" && <span className="text-[9px] font-bold text-red-700 uppercase tracking-widest">Critical</span>}
                                        </div>
                                        <div className="font-semibold text-sm text-[#0A192F] line-clamp-2 leading-tight">{i.title}</div>
                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                                            <StatusBadge status={i.status} />
                                            <span className="text-[10px] text-slate-400 font-mono">{(i.upvotes || 0).toLocaleString()} support</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                            {filtered.length === 0 && <div className="p-6 text-center text-sm text-slate-400 italic">Nothing matches this filter.</div>}
                        </div>
                    </div>
                </div>

                {/* Detail */}
                <div className="lg:col-span-7 space-y-4">
                    {selected && (
                    <>
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg overflow-hidden" data-testid="official-detail">
                        {selected.photos?.[0] && (
                            <div className="aspect-video bg-slate-100">
                                <img src={photoUrl(selected.photos[0])} className="w-full h-full object-cover" alt="" />
                            </div>
                        )}
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-2 flex-wrap">
                                <CategoryChip categoryId={selected.category} />
                                <StatusBadge status={selected.status} />
                                <span className="font-mono text-xs text-slate-400">#{selected.issue_id}</span>
                                <Link to={`/issue/${selected.issue_id}`} className="text-xs text-[#FF9933] font-semibold ml-auto hover:underline">View public page →</Link>
                            </div>
                            <h2 className="font-serif text-2xl leading-tight text-[#0A192F]">{selected.title}</h2>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{selected.description}</p>
                            <div className="grid grid-cols-2 gap-3 p-4 bg-[#FAF9F6] rounded-md text-xs">
                                <div>
                                    <div className="overline text-slate-500 mb-1">Location</div>
                                    <div className="text-[#0A192F]">{selected.location?.address || "—"}</div>
                                </div>
                                <div>
                                    <div className="overline text-slate-500 mb-1">Pincode</div>
                                    <div className="font-mono text-[#0A192F]">{selected.location?.pincode || "—"}</div>
                                </div>
                                <div>
                                    <div className="overline text-slate-500 mb-1">Reporter</div>
                                    <div className="text-[#0A192F]">{selected.reporter?.anonymous ? "Anonymous" : selected.reporter?.name}</div>
                                </div>
                                <div>
                                    <div className="overline text-slate-500 mb-1">Citizens supporting</div>
                                    <div className="font-mono font-bold text-[#FF9933]">{(selected.upvotes || 0).toLocaleString()}</div>
                                </div>
                            </div>
                            {selected.status === "closure_requested" && selected.closure?.comment && (
                                <div className="p-4 border border-amber-200 bg-amber-50 rounded-md text-sm" data-testid="official-closure-note">
                                    <div className="overline text-amber-700 mb-1">Closure request</div>
                                    <p className="italic text-slate-700">&ldquo;{selected.closure.comment}&rdquo;</p>
                                    <div className="text-[10px] text-slate-500 mt-1">— {selected.closure.requested_by_name}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action panel */}
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-6 space-y-5">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={16} className="text-[#FF9933]" />
                            <div className="font-serif text-lg">Take action</div>
                        </div>
                        {selected.status === "closure_requested" ? (
                            <div className="space-y-3">
                                <p className="text-sm text-slate-600">The citizen says this is fixed. Approve to permanently close, or reject and reopen.</p>
                                <textarea
                                    data-testid="official-decision-remark"
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    rows={2}
                                    placeholder="Optional public remark (visible on audit log)"
                                    className="w-full border border-[#0A192F]/15 rounded-md px-3 py-2 text-sm bg-[#FAF9F6] focus:outline-none focus:border-[#0A192F]"
                                />
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => decideClosure("approve")} disabled={!!decisionBusy} data-testid="official-closure-approve" className="inline-flex items-center gap-2 bg-emerald-700 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-emerald-800 disabled:opacity-60">
                                        {decisionBusy === "approve" ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />} Approve & close
                                    </button>
                                    <button onClick={() => decideClosure("reject")} disabled={!!decisionBusy} data-testid="official-closure-reject" className="inline-flex items-center gap-2 bg-white border border-red-200 text-red-700 font-semibold px-4 py-2 rounded-md text-sm hover:bg-red-50 disabled:opacity-60">
                                        {decisionBusy === "reject" ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />} Reject & reopen
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="overline text-slate-500 mb-2">Change status</div>
                                        <Select value={newStatus} onValueChange={setNewStatus}>
                                            <SelectTrigger data-testid="official-status-select"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="under_review">Under Review</SelectItem>
                                                <SelectItem value="assigned">Assigned</SelectItem>
                                                <SelectItem value="in_progress">In Progress</SelectItem>
                                                <SelectItem value="resolved">Resolved</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <div className="overline text-slate-500 mb-2 flex items-center gap-1"><MessageSquare size={12} /> Public remark</div>
                                    <textarea
                                        data-testid="official-remark"
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                        rows={3}
                                        placeholder="Add a note visible to the citizen and on the public audit log..."
                                        className="w-full border border-[#0A192F]/15 rounded-md px-3 py-2 text-sm bg-[#FAF9F6] focus:outline-none focus:border-[#0A192F]"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={handleUpdate}
                                        disabled={busy === "update"}
                                        data-testid="official-update-btn"
                                        className="inline-flex items-center gap-2 bg-[#0A192F] text-white font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#FF9933] transition-colors disabled:opacity-60"
                                    >
                                        {busy === "update" ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={15} />} Update status
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    </>
                    )}
                </div>
            </div>
            )}
        </div>
    );
}

const Kpi = ({ num, label, accent = "text-[#0A192F]" }) => (
    <div>
        <div className={`font-serif text-2xl sm:text-3xl tracking-tight ${accent}`}>{num}</div>
        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{label}</div>
    </div>
);
