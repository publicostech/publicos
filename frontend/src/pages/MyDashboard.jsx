import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { ArrowRight, Plus, MapPin, Clock, Award, AlertCircle, Loader2 } from "lucide-react";
import { StatusBadge } from "../components/shared/StatusBadge";
import { CategoryChip } from "../components/shared/CategoryIcon";

const ApprovalBadge = ({ status }) => {
    if (status === "approved")
        return <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Public</span>;
    if (status === "rejected")
        return <span className="text-[10px] font-bold uppercase tracking-widest text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">Rejected</span>;
    return <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">Pending review</span>;
};

export default function MyDashboard() {
    const { user } = useAuth();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/me/issues")
            .then((r) => setIssues(r.data))
            .catch(() => setIssues([]))
            .finally(() => setLoading(false));
    }, []);

    const stats = {
        total: issues.length,
        approved: issues.filter((i) => i.approval_status === "approved").length,
        resolved: issues.filter((i) => i.status === "resolved").length,
        pending: issues.filter((i) => i.approval_status === "pending").length,
    };

    return (
        <div data-testid="page-my-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-14">
            {/* Profile header */}
            <div className="bg-[#0A192F] text-white rounded-lg p-6 md:p-8 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #FF9933 0%, transparent 40%), radial-gradient(circle at 20% 80%, #138808 0%, transparent 40%)" }} />
                <div className="relative flex flex-col md:flex-row gap-5 items-start md:items-end justify-between">
                    <div className="flex gap-4 items-center min-w-0">
                        {user?.picture ? (
                            <img src={user.picture} alt="" className="w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 border-[#FF9933] object-cover" />
                        ) : (
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-[#FF9933] border-2 border-[#FF9933] flex items-center justify-center font-serif text-2xl md:text-3xl">
                                {user?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                        )}
                        <div className="min-w-0">
                            <div className="overline text-[#FF9933] mb-1">Citizen Dashboard</div>
                            <h1 className="font-serif text-2xl md:text-4xl tracking-tight truncate">{user?.name}</h1>
                            <div className="text-xs md:text-sm text-white/60 mt-1 truncate">{user?.email}</div>
                        </div>
                    </div>
                    <Link to="/submit" data-testid="dashboard-new-report" className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#FF9933] text-white font-semibold px-4 py-2.5 rounded-md hover:bg-white hover:text-[#0A192F] transition-colors">
                        <Plus size={16} /> New report
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                <DashStat label="Total reports" value={stats.total} testid="stat-total" />
                <DashStat label="Public" value={stats.approved} accent="text-emerald-700" testid="stat-public" />
                <DashStat label="Resolved" value={stats.resolved} accent="text-[#138808]" testid="stat-resolved" />
                <DashStat label="Pending review" value={stats.pending} accent="text-amber-700" testid="stat-pending" />
            </div>

            {/* List */}
            <div className="mb-3 flex items-center justify-between">
                <h2 className="font-serif text-xl md:text-2xl text-[#0A192F]">Your reports</h2>
                <span className="text-xs font-mono text-slate-500">{stats.total} total</span>
            </div>

            {loading ? (
                <div className="py-16 flex justify-center"><Loader2 size={24} className="animate-spin text-[#FF9933]" /></div>
            ) : issues.length === 0 ? (
                <div className="bg-white border border-dashed border-[#0A192F]/15 rounded-lg p-10 text-center" data-testid="dashboard-empty">
                    <AlertCircle size={28} className="mx-auto text-[#FF9933] mb-3" />
                    <div className="font-serif text-xl text-[#0A192F] mb-2">No reports yet.</div>
                    <p className="text-sm text-slate-500 mb-4">Your civic voice starts with the first report.</p>
                    <Link to="/submit" className="inline-flex items-center gap-2 bg-[#0A192F] text-white font-semibold px-5 py-2.5 rounded-md hover:bg-[#FF9933]">
                        Report your first issue <ArrowRight size={14} />
                    </Link>
                </div>
            ) : (
                <div className="space-y-3" data-testid="dashboard-issues">
                    {issues.map((i) => (
                        <Link key={i.issue_id} to={`/issue/${i.issue_id}`} className="block bg-white border border-[#0A192F]/10 rounded-lg p-4 md:p-5 hover:border-[#0A192F]/30 transition-colors" data-testid={`my-issue-${i.issue_id}`}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {i.photos?.[0] && (
                                    <img src={i.photos[0]} alt="" className="w-full sm:w-32 h-32 sm:h-24 object-cover rounded-md shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                        <ApprovalBadge status={i.approval_status} />
                                        <StatusBadge status={i.status} />
                                        <span className="font-mono text-[10px] text-slate-400">#{i.issue_id}</span>
                                    </div>
                                    <h3 className="font-serif text-lg leading-tight text-[#0A192F] mb-2 line-clamp-2">{i.title}</h3>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                        <CategoryChip categoryId={i.category} />
                                        <span className="inline-flex items-center gap-1"><MapPin size={11} /> {i.location?.city || "—"}</span>
                                        <span className="inline-flex items-center gap-1"><Clock size={11} /> {new Date(i.posted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                                        <span className="inline-flex items-center gap-1"><Award size={11} className="text-[#FF9933]" /> {i.upvotes} support</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

const DashStat = ({ label, value, accent = "text-[#0A192F]", testid }) => (
    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-4 md:p-5" data-testid={testid}>
        <div className="overline text-slate-500 mb-2">{label}</div>
        <div className={`font-serif text-2xl md:text-3xl tracking-tight ${accent}`}>{value}</div>
    </div>
);
