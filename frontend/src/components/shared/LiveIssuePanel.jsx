import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { ISSUES } from "../../lib/mockData";

const STATUS_META = {
    submitted: { label: "SUBMITTED", color: "#94a3b8" },
    under_review: { label: "UNDER REVIEW", color: "#3B82F6" },
    assigned: { label: "ASSIGNED", color: "#F59E0B" },
    in_progress: { label: "IN PROGRESS", color: "#FF9933" },
    resolved: { label: "RESOLVED", color: "#138808" },
    rejected: { label: "REJECTED", color: "#dc2626" },
};

// Keep only issues with photos, cycle through the first 6
const LIVE_ISSUES = ISSUES.filter((i) => i.photos?.length).slice(0, 6);

const INTERVAL = 4200;

export const LiveIssuePanel = () => {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % LIVE_ISSUES.length);
        }, INTERVAL);
        return () => clearInterval(id);
    }, [paused]);

    const issue = LIVE_ISSUES[index];
    const status = STATUS_META[issue.status] || STATUS_META.submitted;
    const responseHours = Math.max(1, Math.round(issue.upvotes / 300));

    return (
        <div
            className="bg-[#0A192F] text-white rounded-lg overflow-hidden border border-[#0A192F] relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            data-testid="live-issue-panel"
        >
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 z-20">
                <motion.div
                    key={index + (paused ? "-p" : "")}
                    className="h-full"
                    style={{ background: status.color }}
                    initial={{ width: "0%" }}
                    animate={{ width: paused ? "100%" : "100%" }}
                    transition={{ duration: paused ? 0 : INTERVAL / 1000, ease: "linear" }}
                />
            </div>

            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/10 relative z-10">
                <div>
                    <div className="overline text-[#FF9933] flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9933] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9933]" />
                        </span>
                        Live Issue
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={issue.id}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.35 }}
                            className="font-mono text-xs text-white/60 mt-1"
                        >
                            #{issue.id}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: status.color }} />
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={issue.id + "-s"}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-xs font-semibold tracking-wider"
                        >
                            {status.label}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>

            {/* Image */}
            <div className="aspect-[16/10] overflow-hidden relative bg-slate-800">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={issue.id + "-img"}
                        src={issue.photos[0]}
                        alt={issue.title}
                        initial={{ opacity: 0, scale: 1.06 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </AnimatePresence>
                {/* Indicator dots */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {LIVE_ISSUES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            aria-label={`Show issue ${i + 1}`}
                            data-testid={`live-dot-${i}`}
                            className={`h-1.5 rounded-full transition-all ${
                                i === index ? "w-8 bg-[#FF9933]" : "w-1.5 bg-white/50 hover:bg-white/80"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-3 relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={issue.id + "-body"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link to={`/issue/${issue.id}`} className="block group">
                            <h3 className="font-serif text-xl leading-tight group-hover:text-[#FF9933] transition-colors">
                                {issue.title}
                            </h3>
                        </Link>
                        <div className="flex items-center gap-3 text-xs text-white/60 mt-2.5">
                            <span className="inline-flex items-center gap-1">
                                <MapPin size={12} />
                                {issue.location.city}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Clock size={12} />
                                {responseHours}h response time
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full border-2 border-[#0A192F] bg-[#FF9933]" />
                        <div className="w-7 h-7 rounded-full border-2 border-[#0A192F] bg-[#138808]" />
                        <div className="w-7 h-7 rounded-full border-2 border-[#0A192F] bg-white" />
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={issue.id + "-sup"}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.35 }}
                            className="text-xs text-white/60 inline-flex items-center gap-1.5"
                        >
                            <ArrowUp size={12} className="text-[#FF9933]" />
                            <span className="font-mono text-[#FF9933] font-bold">
                                {issue.upvotes.toLocaleString()}
                            </span>
                            <span>citizens supporting</span>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default LiveIssuePanel;
