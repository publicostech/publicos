import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Eye, ShieldCheck, BarChart3 } from "lucide-react";
import { useLang } from "../../lib/i18n";

// Pre-launch mission panel that rotates through PublicOS pillars.
// Each pillar uses a custom 3D illustration as the card background.

const INTERVAL = 5500;

const PILLAR_DEFS = [
    {
        id: "citizen",
        icon: Users,
        accent: "#FF9933",
        glow: "rgba(255, 153, 51, 0.35)",
        image: "https://customer-assets.emergentagent.com/job_civictrack-3/artifacts/15v807kk_card01.png",
        tagKey: "landing.pillar_citizen_tag",
        titleKey: "landing.pillar_citizen_title",
        descKey: "landing.pillar_citizen_desc",
    },
    {
        id: "transparent",
        icon: Eye,
        accent: "#60A5FA",
        glow: "rgba(96, 165, 250, 0.35)",
        image: "https://customer-assets.emergentagent.com/job_civictrack-3/artifacts/3u4aqthq_card02.png",
        tagKey: "landing.pillar_transparent_tag",
        titleKey: "landing.pillar_transparent_title",
        descKey: "landing.pillar_transparent_desc",
    },
    {
        id: "accountability",
        icon: ShieldCheck,
        accent: "#34D399",
        glow: "rgba(52, 211, 153, 0.35)",
        image: "https://customer-assets.emergentagent.com/job_civictrack-3/artifacts/tg6hfoxw_card03.png",
        tagKey: "landing.pillar_accountable_tag",
        titleKey: "landing.pillar_accountable_title",
        descKey: "landing.pillar_accountable_desc",
    },
    {
        id: "data",
        icon: BarChart3,
        accent: "#A78BFA",
        glow: "rgba(167, 139, 250, 0.35)",
        image: "https://customer-assets.emergentagent.com/job_civictrack-3/artifacts/lybwwv6q_card04.png",
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
        // Preload illustrations so the crossfade is instant on first rotation
        PILLAR_DEFS.forEach((p) => {
            const img = new Image();
            img.src = p.image;
        });
    }, []);

    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => setIndex((i) => (i + 1) % PILLAR_DEFS.length), INTERVAL);
        return () => clearInterval(id);
    }, [paused]);

    const p = PILLAR_DEFS[index];
    const Icon = p.icon;

    return (
        <div
            className="relative rounded-2xl overflow-hidden bg-[#0A192F] shadow-[0_30px_80px_-20px_rgba(10,25,47,0.5)] min-h-[460px] flex flex-col"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            data-testid="promise-panel"
            style={{
                border: `1px solid ${p.glow}`,
                transition: "border-color 600ms ease",
            }}
        >
            {/* Background illustration — crossfades between pillars */}
            <AnimatePresence>
                <motion.div
                    key={`bg-${p.id}`}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${p.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center right",
                        backgroundRepeat: "no-repeat",
                    }}
                />
            </AnimatePresence>

            {/* Left-side gradient veil — keeps text legible over the busy right side */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(95deg, rgba(10,25,47,0.92) 0%, rgba(10,25,47,0.78) 30%, rgba(10,25,47,0.35) 60%, rgba(10,25,47,0) 100%)",
                }}
            />

            {/* Accent glow that shifts colour per pillar */}
            <div
                className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full blur-3xl opacity-50 pointer-events-none transition-colors duration-700"
                style={{ background: p.glow }}
            />

            {/* Top progress bar */}
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

            {/* Header strip */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2">
                <div className="inline-flex items-center gap-2">
                    <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: p.accent }}
                    />
                    <span className="overline" style={{ color: p.accent }}>
                        {t("landing.promise_eyebrow")}
                    </span>
                </div>
                <div className="text-[10px] font-mono text-white/50 tracking-widest">
                    0{index + 1} / 0{PILLAR_DEFS.length}
                </div>
            </div>

            {/* Rotating text content (left half) */}
            <div className="relative z-10 flex-1 px-6 pb-6 pt-3 flex">
                <div className="w-[58%] flex flex-col">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`txt-${p.id}`}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="flex flex-col h-full"
                        >
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 backdrop-blur-md"
                                style={{
                                    background: `linear-gradient(135deg, ${p.accent}22, ${p.accent}08)`,
                                    border: `1px solid ${p.glow}`,
                                    boxShadow: `0 8px 24px -8px ${p.glow}`,
                                }}
                            >
                                <Icon size={24} strokeWidth={1.5} style={{ color: p.accent }} />
                            </div>

                            <div className="overline text-white/50 mb-2.5">{t(p.tagKey)}</div>
                            <div
                                className="font-serif text-2xl md:text-[1.75rem] leading-[1.15] tracking-tight mb-3 text-white"
                                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
                            >
                                {t(p.titleKey)}
                            </div>
                            <p className="text-[13px] text-white/75 leading-relaxed">{t(p.descKey)}</p>
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-auto pt-5 border-t border-white/10 flex items-center justify-between text-[10px] text-white/45 font-mono">
                        <span>{t("landing.promise_footer")}</span>
                        <span style={{ color: p.accent }}>●●●●</span>
                    </div>
                </div>
            </div>

            {/* Dot navigation */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                {PILLAR_DEFS.map((pill, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        aria-label={`pillar ${i + 1}`}
                        className="h-1 rounded-full transition-all"
                        style={{
                            width: i === index ? 26 : 8,
                            background: i === index ? pill.accent : "rgba(255,255,255,0.25)",
                        }}
                        data-testid={`promise-dot-${i}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default LiveIssuePanel;
