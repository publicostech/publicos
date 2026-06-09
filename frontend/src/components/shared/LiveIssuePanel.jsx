import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Eye, ShieldCheck, BarChart3 } from "lucide-react";
import { useLang } from "../../lib/i18n";

// Pre-launch mission panel that rotates through PublicOS pillars.
// Replaces the previous LiveIssuePanel which showed fabricated civic data.

const INTERVAL = 4500;

const PILLAR_DEFS = [
    {
        id: "citizen",
        icon: Users,
        accent: "#FF9933",
        tagKey: "landing.pillar_citizen_tag",
        titleKey: "landing.pillar_citizen_title",
        descKey: "landing.pillar_citizen_desc",
    },
    {
        id: "transparent",
        icon: Eye,
        accent: "#3B82F6",
        tagKey: "landing.pillar_transparent_tag",
        titleKey: "landing.pillar_transparent_title",
        descKey: "landing.pillar_transparent_desc",
    },
    {
        id: "accountability",
        icon: ShieldCheck,
        accent: "#138808",
        tagKey: "landing.pillar_accountable_tag",
        titleKey: "landing.pillar_accountable_title",
        descKey: "landing.pillar_accountable_desc",
    },
    {
        id: "data",
        icon: BarChart3,
        accent: "#8B5CF6",
        tagKey: "landing.pillar_data_tag",
        titleKey: "landing.pillar_data_title",
        descKey: "landing.pillar_data_desc",
    },
];

export const LiveIssuePanel = () => {
    const { t } = useLang();
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => setIndex((i) => (i + 1) % PILLAR_DEFS.length), INTERVAL);
        return () => clearInterval(id);
    }, [paused]);

    const p = PILLAR_DEFS[index];
    const Icon = p.icon;

    return (
        <div
            className="bg-[#0A192F] text-white rounded-lg overflow-hidden border border-[#0A192F] relative min-h-[440px] flex flex-col"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            data-testid="promise-panel"
        >
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 z-20">
                <motion.div
                    key={index + (paused ? "-p" : "")}
                    className="h-full"
                    style={{ background: p.accent }}
                    initial={{ width: "0%" }}
                    animate={{ width: paused ? "0%" : "100%" }}
                    transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                />
            </div>

            {/* Card title strip */}
            <div className="flex items-center justify-between px-5 pt-5 pb-2">
                <div className="inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: p.accent }} />
                    <span className="overline" style={{ color: p.accent }}>{t("landing.promise_eyebrow")}</span>
                </div>
                <div className="text-[10px] font-mono text-white/40 tracking-widest">
                    0{index + 1} / 0{PILLAR_DEFS.length}
                </div>
            </div>

            {/* Rotating content */}
            <div className="relative flex-1 px-6 pb-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="h-full flex flex-col"
                    >
                        {/* Icon hero */}
                        <div className="mt-3 mb-6">
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                style={{
                                    background: `linear-gradient(135deg, ${p.accent}22, ${p.accent}06)`,
                                    border: `1px solid ${p.accent}55`,
                                }}
                            >
                                <Icon size={28} strokeWidth={1.5} style={{ color: p.accent }} />
                            </div>
                        </div>

                        <div className="overline text-white/40 mb-3">{t(p.tagKey)}</div>
                        <div className="font-serif text-3xl md:text-[2.1rem] leading-[1.1] tracking-tight mb-4">
                            {t(p.titleKey)}
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed max-w-md">
                            {t(p.descKey)}
                        </p>

                        <div className="mt-auto pt-6 flex items-center justify-between text-[11px] text-white/45 font-mono border-t border-white/10">
                            <span>{t("landing.promise_footer")}</span>
                            <span style={{ color: p.accent }}>●●●●</span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Dot navigation */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {PILLAR_DEFS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        aria-label={`pillar ${i + 1}`}
                        className={`h-1 rounded-full transition-all ${i === index ? "w-6 bg-[#FF9933]" : "w-2 bg-white/20"}`}
                        data-testid={`promise-dot-${i}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default LiveIssuePanel;
