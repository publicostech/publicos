import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, MessageCircle, Share2, MapPin, Clock } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { CategoryChip } from "./CategoryIcon";
import { motion } from "framer-motion";

const timeAgo = (iso) => {
    const d = new Date(iso);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

export const IssueCard = ({ issue, compact = false }) => {
    const [supported, setSupported] = useState(false);
    const [count, setCount] = useState(issue.upvotes);

    const handleUpvote = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setSupported(!supported);
        setCount(supported ? count - 1 : count + 1);
    };

    return (
        <motion.article
            data-testid={`issue-card-${issue.id}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="group bg-white border border-[#0A192F]/10 rounded-lg overflow-hidden hover:border-[#0A192F]/30 hover:-translate-y-1 transition-all duration-200"
        >
            <Link to={`/issue/${issue.id}`} className="block">
                {issue.photos?.[0] && !compact && (
                    <div className="aspect-[16/9] overflow-hidden bg-slate-100 relative">
                        <img
                            src={issue.photos[0]}
                            alt={issue.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                            <StatusBadge status={issue.status} />
                        </div>
                        <div className="absolute bottom-3 left-3 bg-[#0A192F] text-white px-2 py-1 rounded text-[10px] font-mono tracking-wider">
                            #{issue.id}
                        </div>
                    </div>
                )}
                <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <CategoryChip categoryId={issue.category} />
                        {compact && <StatusBadge status={issue.status} />}
                        {issue.urgency === "critical" && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                                Critical
                            </span>
                        )}
                    </div>
                    <h3 className="font-serif text-xl leading-tight text-[#0A192F] group-hover:text-[#FF9933] transition-colors">
                        {issue.title}
                    </h3>
                    {!compact && (
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                            {issue.description}
                        </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                        <span className="inline-flex items-center gap-1">
                            <MapPin size={12} strokeWidth={1.75} />
                            {issue.location.city}, {issue.location.state}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <Clock size={12} strokeWidth={1.75} />
                            {timeAgo(issue.postedAt)}
                        </span>
                    </div>
                </div>
            </Link>
            <div className="px-5 pb-4 flex items-center justify-between border-t border-[#0A192F]/5 pt-3">
                <div className="flex items-center gap-3">
                    <button
                        data-testid={`upvote-btn-${issue.id}`}
                        onClick={handleUpvote}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                            supported
                                ? "bg-[#FF9933] text-white border-[#FF9933]"
                                : "bg-white text-[#0A192F] border-[#0A192F]/15 hover:bg-[#FAF9F6]"
                        }`}
                    >
                        <ArrowUp size={14} strokeWidth={2} />
                        <span className="font-mono">{count.toLocaleString()}</span>
                    </button>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <MessageCircle size={13} strokeWidth={1.75} />
                        {issue.comments}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <Share2 size={13} strokeWidth={1.75} />
                        {issue.shares}
                    </span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                    {issue.reporter.anonymous ? "Anonymous" : issue.reporter.name}
                </div>
            </div>
        </motion.article>
    );
};

export default IssueCard;
