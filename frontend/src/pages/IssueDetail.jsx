import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft, ArrowUp, MessageCircle, Share2, MapPin, Clock, ShieldCheck,
    Flag, CheckCircle2, User, Landmark,
} from "lucide-react";
import { ISSUES, COMMENTS } from "../lib/mockData";
import { StatusBadge } from "../components/shared/StatusBadge";
import { CategoryChip } from "../components/shared/CategoryIcon";
import LocationPreview from "../components/shared/LocationPreview";
import { toast } from "sonner";

export default function IssueDetail() {
    const { id } = useParams();
    const issue = ISSUES.find((i) => i.id === id) || ISSUES[0];
    const [activePhoto, setActivePhoto] = useState(0);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState(COMMENTS);
    const [supported, setSupported] = useState(false);

    const postComment = () => {
        if (!comment.trim()) return;
        setComments([{ user: "You", text: comment, at: "just now", upvotes: 0 }, ...comments]);
        setComment("");
        toast.success("Comment posted");
    };

    return (
        <div data-testid="page-issue-detail" className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-14">
            <Link to="/feed" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#0A192F] mb-8" data-testid="issue-back-link">
                <ArrowLeft size={14} /> Back to feed
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-2 flex-wrap mb-4">
                            <CategoryChip categoryId={issue.category} />
                            <StatusBadge status={issue.status} />
                            {issue.urgency === "critical" && (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">Critical</span>
                            )}
                            <span className="font-mono text-xs text-slate-400 ml-auto">#{issue.id}</span>
                        </div>
                        <h1 className="font-serif text-3xl md:text-5xl tracking-tight text-[#0A192F] leading-tight">
                            {issue.title}
                        </h1>
                        <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                                <User size={12} /> {issue.reporter.anonymous ? "Anonymous citizen" : issue.reporter.name}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Clock size={12} /> Reported {new Date(issue.postedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <MapPin size={12} /> {issue.location.city}, {issue.location.state}
                            </span>
                        </div>
                    </div>

                    {/* Photo */}
                    {issue.photos?.length > 0 && (
                        <div className="space-y-2">
                            <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-[#0A192F]/10">
                                <img src={issue.photos[activePhoto]} alt={issue.title} className="w-full h-full object-cover" />
                            </div>
                            {issue.photos.length > 1 && (
                                <div className="flex gap-2">
                                    {issue.photos.map((p, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActivePhoto(i)}
                                            className={`aspect-square w-20 rounded-md overflow-hidden border-2 ${activePhoto === i ? "border-[#FF9933]" : "border-transparent"}`}
                                            data-testid={`issue-photo-${i}`}
                                        >
                                            <img src={p} className="w-full h-full object-cover" alt="" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-6">
                        <div className="overline text-slate-500 mb-3">Description</div>
                        <p className="text-slate-700 leading-relaxed">{issue.description}</p>
                    </div>

                    {/* Action bar */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={() => setSupported(!supported)}
                            data-testid="issue-detail-upvote"
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm transition-colors ${
                                supported ? "bg-[#FF9933] text-white" : "bg-[#0A192F] text-white hover:bg-[#FF9933]"
                            }`}
                        >
                            <ArrowUp size={16} /> Support ({(issue.upvotes + (supported ? 1 : 0)).toLocaleString()})
                        </button>
                        <button className="inline-flex items-center gap-2 bg-white border border-[#0A192F]/15 font-semibold text-sm px-4 py-2.5 rounded-md hover:border-[#0A192F]" data-testid="issue-share">
                            <Share2 size={15} /> Share
                        </button>
                        <button className="inline-flex items-center gap-2 bg-white border border-[#0A192F]/15 font-semibold text-sm px-4 py-2.5 rounded-md hover:border-[#0A192F]" data-testid="issue-flag">
                            <Flag size={15} /> Flag
                        </button>
                    </div>

                    {/* Comments */}
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-6" data-testid="issue-comments">
                        <div className="font-serif text-xl mb-5 text-[#0A192F]">Comments ({comments.length})</div>
                        <div className="flex gap-3 mb-6">
                            <input
                                data-testid="issue-comment-input"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a thoughtful comment..."
                                className="flex-1 border border-[#0A192F]/15 rounded-md px-4 py-2.5 text-sm bg-[#FAF9F6] focus:outline-none focus:border-[#0A192F]"
                            />
                            <button
                                onClick={postComment}
                                data-testid="issue-comment-submit"
                                className="bg-[#0A192F] text-white font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#FF9933] transition-colors"
                            >
                                Post
                            </button>
                        </div>
                        <div className="space-y-4">
                            {comments.map((c, i) => (
                                <div key={i} className={`flex gap-3 p-4 rounded-md ${c.official ? "bg-[#FAF9F6] border border-[#138808]/20" : ""}`}>
                                    <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${c.official ? "bg-[#138808] text-white" : "bg-slate-200 text-slate-600"}`}>
                                        {c.official ? <Landmark size={14} /> : c.user.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-sm text-[#0A192F]">{c.user}</span>
                                            {c.official && <span className="text-[10px] font-bold text-[#138808] uppercase tracking-widest">Official</span>}
                                            <span className="text-xs text-slate-400">{c.at}</span>
                                        </div>
                                        <p className="text-sm text-slate-700">{c.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-4 space-y-5">
                    {/* Assigned dept */}
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-5">
                        <div className="overline text-slate-500 mb-3">Assigned to</div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-[#0A192F] flex items-center justify-center text-white">
                                <Landmark size={18} />
                            </div>
                            <div>
                                <div className="font-semibold text-sm text-[#0A192F]">{issue.assignedDept || "Pending assignment"}</div>
                                <div className="text-xs text-slate-500">SLA: 5 working days</div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-5" data-testid="issue-timeline">
                        <div className="overline text-slate-500 mb-4">Public timeline</div>
                        <div className="space-y-4 relative">
                            {issue.timeline.map((t, i) => (
                                <div key={i} className="flex gap-3 relative">
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full border-2 ${i === issue.timeline.length - 1 ? "bg-[#FF9933] border-[#FF9933]" : "bg-white border-[#0A192F]"}`} />
                                        {i < issue.timeline.length - 1 && <div className="w-0.5 flex-1 bg-[#0A192F]/15 mt-1 min-h-[24px]" />}
                                    </div>
                                    <div className="flex-1 pb-4">
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

                    {/* Location */}
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-5">
                        <div className="overline text-slate-500 mb-3">Location</div>
                        {issue.location.lat && issue.location.lng && (
                            <div className="mb-4">
                                <LocationPreview lat={issue.location.lat} lng={issue.location.lng} height={160} />
                            </div>
                        )}
                        <div className="space-y-2 text-sm">
                            <Row label="Address" value={issue.location.address} />
                            <Row label="City" value={issue.location.city} />
                            <Row label="District" value={issue.location.district} />
                            <Row label="State" value={issue.location.state} />
                            <Row label="Pincode" value={issue.location.pincode} mono />
                        </div>
                    </div>

                    {/* Trust */}
                    <div className="bg-[#0A192F] text-white rounded-lg p-5">
                        <ShieldCheck size={20} className="text-[#FF9933] mb-3" strokeWidth={1.5} />
                        <div className="font-serif text-lg mb-1">Public audit log</div>
                        <p className="text-xs text-white/70 leading-relaxed">
                            Every action on this issue — submissions, status changes, officer remarks — is immutably logged and visible to all.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}

const Row = ({ label, value, mono }) => (
    <div className="flex items-start justify-between gap-4">
        <div className="overline text-slate-500">{label}</div>
        <div className={`text-right text-[#0A192F] ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
);
