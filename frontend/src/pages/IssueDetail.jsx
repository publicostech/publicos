import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft, ArrowUp, MessageCircle, Share2, MapPin, Clock, ShieldCheck,
    Flag, User, Landmark, Loader2, CheckCircle2, XCircle, RotateCcw,
} from "lucide-react";
import { api, formatApiError } from "../lib/api";
import { useAuth } from "../lib/auth";
import { StatusBadge } from "../components/shared/StatusBadge";
import { CategoryChip } from "../components/shared/CategoryIcon";
import LocationPreview from "../components/shared/LocationPreview";
import { toast } from "sonner";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const photoUrl = (p) => (p?.startsWith("http") ? p : `${BACKEND}${p}`);

export default function IssueDetail() {
    const { id } = useParams();
    const nav = useNavigate();
    const { user } = useAuth();
    const [issue, setIssue] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activePhoto, setActivePhoto] = useState(0);
    const [comment, setComment] = useState("");
    const [supported, setSupported] = useState(false);
    const [posting, setPosting] = useState(false);
    const [closureOpen, setClosureOpen] = useState(false);
    const [closureNote, setClosureNote] = useState("");
    const [closureBusy, setClosureBusy] = useState(false);
    const [decisionBusy, setDecisionBusy] = useState("");

    const reload = async () => {
        const [iss, cm] = await Promise.all([
            api.get(`/issues/${id}`).then((r) => r.data),
            api.get(`/issues/${id}/comments`).then((r) => r.data).catch(() => []),
        ]);
        setIssue(iss);
        setComments(cm);
    };

    const submitClosureRequest = async () => {
        if (closureNote.trim().length < 4) {
            toast.error("Please describe what was done");
            return;
        }
        setClosureBusy(true);
        try {
            await api.post(`/issues/${id}/request-closure`, { comment: closureNote.trim(), proof_photos: [] });
            toast.success("Closure requested — an admin will verify");
            setClosureOpen(false);
            setClosureNote("");
            await reload();
        } catch (e) {
            toast.error(formatApiError(e));
        } finally {
            setClosureBusy(false);
        }
    };

    const decideClosure = async (decision) => {
        setDecisionBusy(decision);
        try {
            await api.post(`/admin/issues/${id}/closure-decision`, { decision, remark: "" });
            toast.success(decision === "approve" ? "Issue closed" : "Closure rejected — issue reopened");
            await reload();
        } catch (e) {
            toast.error(formatApiError(e));
        } finally {
            setDecisionBusy("");
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.get(`/issues/${id}`).then((r) => r.data),
            api.get(`/issues/${id}/comments`).then((r) => r.data).catch(() => []),
        ])
            .then(([iss, cm]) => {
                setIssue(iss);
                setComments(cm);
                if (user && iss?.upvoted_by?.includes(user.user_id)) setSupported(true);
            })
            .catch(() => setIssue(null))
            .finally(() => setLoading(false));
    }, [id, user]);

    const handleUpvote = async () => {
        if (!user) {
            toast.error("Please log in to support an issue");
            nav("/login");
            return;
        }
        try {
            const { data } = await api.post(`/issues/${id}/upvote`);
            setSupported(data.supported);
            setIssue((prev) => prev && { ...prev, upvotes: data.upvotes });
        } catch (e) {
            toast.error(formatApiError(e));
        }
    };

    const postComment = async () => {
        if (!comment.trim()) return;
        if (!user) {
            toast.error("Please log in to comment");
            nav("/login");
            return;
        }
        setPosting(true);
        try {
            const { data } = await api.post(`/issues/${id}/comments`, { text: comment });
            setComments([data, ...comments]);
            setComment("");
            setIssue((prev) => prev && { ...prev, comment_count: (prev.comment_count || 0) + 1 });
            toast.success("Comment posted");
        } catch (e) {
            toast.error(formatApiError(e));
        } finally {
            setPosting(false);
        }
    };

    if (loading) {
        return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 size={32} className="animate-spin text-[#FF9933]" /></div>;
    }
    if (!issue) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-16 text-center" data-testid="issue-not-found">
                <h1 className="font-serif text-3xl text-[#0A192F] mb-2">Issue not found</h1>
                <p className="text-slate-500 mb-4">It may have been removed or the link is incorrect.</p>
                <Link to="/feed" className="text-[#FF9933] font-semibold">← Back to feed</Link>
            </div>
        );
    }

    const reporter = issue.reporter || {};
    const loc = issue.location || {};

    return (
        <div data-testid="page-issue-detail" className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-14">
            <Link to="/feed" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#0A192F] mb-6" data-testid="issue-back-link">
                <ArrowLeft size={14} /> Back to feed
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                <div className="lg:col-span-8 space-y-5 md:space-y-6">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap mb-3 md:mb-4">
                            <CategoryChip categoryId={issue.category} />
                            <StatusBadge status={issue.status} />
                            {issue.urgency === "critical" && (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">Critical</span>
                            )}
                            {issue.approval_status === "pending" && (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">Pending approval</span>
                            )}
                            <span className="font-mono text-xs text-slate-400 ml-auto">#{issue.issue_id}</span>
                        </div>
                        <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl tracking-tight text-[#0A192F] leading-tight">
                            {issue.title}
                        </h1>
                        <div className="flex items-center gap-3 md:gap-4 mt-3 md:mt-4 text-xs text-slate-500 flex-wrap">
                            <span className="inline-flex items-center gap-1"><User size={12} /> {reporter.anonymous ? "Anonymous citizen" : reporter.name}</span>
                            <span className="inline-flex items-center gap-1"><Clock size={12} /> Reported {new Date(issue.posted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                            <span className="inline-flex items-center gap-1"><MapPin size={12} /> {loc.city}, {loc.state}</span>
                        </div>
                    </div>

                    {issue.photos?.length > 0 && (
                        <div className="space-y-2">
                            <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-[#0A192F]/10">
                                <img src={photoUrl(issue.photos[activePhoto])} alt={issue.title} className="w-full h-full object-cover" />
                            </div>
                            {issue.photos.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {issue.photos.map((p, i) => (
                                        <button key={i} onClick={() => setActivePhoto(i)} className={`aspect-square w-20 shrink-0 rounded-md overflow-hidden border-2 ${activePhoto === i ? "border-[#FF9933]" : "border-transparent"}`} data-testid={`issue-photo-${i}`}>
                                            <img src={photoUrl(p)} className="w-full h-full object-cover" alt="" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-5 md:p-6">
                        <div className="overline text-slate-500 mb-3">Description</div>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{issue.description}</p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <button
                            onClick={handleUpvote}
                            data-testid="issue-detail-upvote"
                            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-md font-semibold text-sm transition-colors ${
                                supported ? "bg-[#FF9933] text-white" : "bg-[#0A192F] text-white hover:bg-[#FF9933]"
                            }`}
                        >
                            <ArrowUp size={16} /> Support ({(issue.upvotes || 0).toLocaleString()})
                        </button>
                        <button
                            onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }}
                            className="inline-flex items-center gap-2 bg-white border border-[#0A192F]/15 font-semibold text-sm px-4 py-2.5 rounded-md hover:border-[#0A192F]" data-testid="issue-share">
                            <Share2 size={15} /> Share
                        </button>
                        <button className="inline-flex items-center gap-2 bg-white border border-[#0A192F]/15 font-semibold text-sm px-4 py-2.5 rounded-md hover:border-[#0A192F]" data-testid="issue-flag">
                            <Flag size={15} /> Flag
                        </button>
                    </div>

                    {/* Closure workflow */}
                    {user && issue.owner_user_id === user.user_id && issue.status !== "closed" && issue.status !== "closure_requested" && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5" data-testid="closure-request-panel">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 size={16} className="text-emerald-700" />
                                <div className="font-serif text-lg text-[#0A192F]">Issue fixed?</div>
                            </div>
                            <p className="text-xs text-slate-600 mb-3">If the problem is resolved on the ground, request closure. An official will verify before it&apos;s permanently closed on the public ledger.</p>
                            {closureOpen ? (
                                <div className="space-y-3">
                                    <textarea
                                        rows={3}
                                        value={closureNote}
                                        onChange={(e) => setClosureNote(e.target.value)}
                                        data-testid="closure-note-input"
                                        placeholder="Describe what was done / when it was fixed (min 4 chars)"
                                        className="w-full border border-emerald-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-emerald-600"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={submitClosureRequest}
                                            disabled={closureBusy}
                                            data-testid="closure-submit"
                                            className="inline-flex items-center gap-2 bg-emerald-700 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-emerald-800 disabled:opacity-60"
                                        >
                                            {closureBusy && <Loader2 size={13} className="animate-spin" />}
                                            Submit closure request
                                        </button>
                                        <button onClick={() => { setClosureOpen(false); setClosureNote(""); }} className="text-sm text-slate-500 px-3 py-2">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setClosureOpen(true)}
                                    data-testid="closure-open-btn"
                                    className="inline-flex items-center gap-2 bg-emerald-700 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-emerald-800"
                                >
                                    <CheckCircle2 size={14} /> Request closure
                                </button>
                            )}
                        </div>
                    )}

                    {issue.status === "closure_requested" && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5" data-testid="closure-pending-panel">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock size={15} className="text-amber-700" />
                                <div className="font-serif text-lg text-[#0A192F]">Closure pending verification</div>
                            </div>
                            {issue.closure?.comment && (
                                <p className="text-sm text-slate-700 italic mb-3">&ldquo;{issue.closure.comment}&rdquo; <span className="text-xs text-slate-500 not-italic">— {issue.closure.requested_by_name}</span></p>
                            )}
                            {user && (user.role === "admin" || user.role === "official") && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <button
                                        onClick={() => decideClosure("approve")}
                                        disabled={!!decisionBusy}
                                        data-testid="closure-approve-btn"
                                        className="inline-flex items-center gap-2 bg-emerald-700 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-emerald-800 disabled:opacity-60"
                                    >
                                        {decisionBusy === "approve" ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                                        Approve & close
                                    </button>
                                    <button
                                        onClick={() => decideClosure("reject")}
                                        disabled={!!decisionBusy}
                                        data-testid="closure-reject-btn"
                                        className="inline-flex items-center gap-2 bg-white border border-red-200 text-red-700 font-semibold px-4 py-2 rounded-md text-sm hover:bg-red-50 disabled:opacity-60"
                                    >
                                        {decisionBusy === "reject" ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
                                        Reject & reopen
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-5 md:p-6" data-testid="issue-comments">
                        <div className="font-serif text-xl mb-4 text-[#0A192F]">Comments ({comments.length})</div>
                        <div className="flex flex-col sm:flex-row gap-3 mb-5">
                            <input
                                data-testid="issue-comment-input"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={user ? "Add a thoughtful comment…" : "Log in to comment"}
                                disabled={!user}
                                className="flex-1 border border-[#0A192F]/15 rounded-md px-4 py-2.5 text-sm bg-[#FAF9F6] focus:outline-none focus:border-[#0A192F] disabled:cursor-not-allowed"
                            />
                            <button
                                onClick={postComment}
                                disabled={posting || !user}
                                data-testid="issue-comment-submit"
                                className="bg-[#0A192F] text-white font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#FF9933] disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {posting ? <Loader2 size={14} className="animate-spin" /> : null}
                                {user ? "Post" : "Log in"}
                            </button>
                        </div>
                        <div className="space-y-4">
                            {comments.length === 0 && <div className="text-sm text-slate-400 italic">No comments yet. Be the first.</div>}
                            {comments.map((c) => (
                                <div key={c.comment_id} className={`flex gap-3 p-4 rounded-md ${c.is_official ? "bg-[#FAF9F6] border border-[#138808]/20" : ""}`}>
                                    <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${c.is_official ? "bg-[#138808] text-white" : "bg-slate-200 text-slate-600"}`}>
                                        {c.is_official ? <Landmark size={14} /> : c.user_name?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="font-semibold text-sm text-[#0A192F]">{c.user_name}</span>
                                            {c.is_official && <span className="text-[10px] font-bold text-[#138808] uppercase tracking-widest">Official</span>}
                                            <span className="text-xs text-slate-400">{new Date(c.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                                        </div>
                                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{c.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="lg:col-span-4 space-y-5">
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-5">
                        <div className="overline text-slate-500 mb-3">Public timeline</div>
                        <div className="space-y-4 relative" data-testid="issue-timeline">
                            {(issue.timeline || []).map((t, i, arr) => (
                                <div key={i} className="flex gap-3 relative">
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full border-2 ${i === arr.length - 1 ? "bg-[#FF9933] border-[#FF9933]" : "bg-white border-[#0A192F]"}`} />
                                        {i < arr.length - 1 && <div className="w-0.5 flex-1 bg-[#0A192F]/15 mt-1 min-h-[24px]" />}
                                    </div>
                                    <div className="flex-1 pb-3">
                                        <div className="text-sm font-semibold text-[#0A192F]">{t.label}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{t.actor}</div>
                                        <div className="text-[10px] font-mono text-slate-400 mt-1">
                                            {new Date(t.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-5">
                        <div className="overline text-slate-500 mb-3">Location</div>
                        {loc.lat && loc.lng && (
                            <div className="mb-4">
                                <LocationPreview lat={loc.lat} lng={loc.lng} height={160} />
                            </div>
                        )}
                        <div className="space-y-2 text-sm">
                            <Row label="Address" value={loc.address} />
                            <Row label="City" value={loc.city} />
                            <Row label="State" value={loc.state} />
                            <Row label="Pincode" value={loc.pincode} mono />
                        </div>
                    </div>

                    <div className="bg-[#0A192F] text-white rounded-lg p-5">
                        <ShieldCheck size={20} className="text-[#FF9933] mb-3" />
                        <div className="font-serif text-lg mb-1">Public audit log</div>
                        <p className="text-xs text-white/70 leading-relaxed">
                            Every action — submission, status changes, admin approval — is immutably logged and visible to all.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}

const Row = ({ label, value, mono }) => (
    <div className="flex items-start justify-between gap-3">
        <div className="overline text-slate-500 shrink-0">{label}</div>
        <div className={`text-right text-[#0A192F] truncate ${mono ? "font-mono" : ""}`}>{value || "—"}</div>
    </div>
);
