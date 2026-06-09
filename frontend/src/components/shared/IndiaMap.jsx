import React, { useState } from "react";
import { INDIA_PATH, STATE_MARKERS } from "../../lib/mockData";
import { motion } from "framer-motion";

export const IndiaMap = ({ onStateClick, activeState = null, mode = "density" }) => {
    const [hovered, setHovered] = useState(null);

    const maxIssues = Math.max(...STATE_MARKERS.map((s) => s.issues));

    const getMarkerSize = (issues) => 8 + (issues / maxIssues) * 26;
    const getMarkerColor = (marker) => {
        if (mode === "resolved") {
            const rate = marker.resolved / marker.issues;
            if (rate > 0.75) return "#138808";
            if (rate > 0.55) return "#FF9933";
            return "#dc2626";
        }
        if (marker.issues > 8000) return "#dc2626";
        if (marker.issues > 4000) return "#FF9933";
        return "#138808";
    };

    return (
        <div className="relative w-full" data-testid="india-map">
            <svg
                viewBox="0 0 1000 900"
                className="w-full h-auto"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Subtle grid background */}
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0A192F" strokeWidth="0.3" opacity="0.08" />
                    </pattern>
                    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FF9933" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#FF9933" stopOpacity="0" />
                    </radialGradient>
                </defs>
                <rect width="1000" height="900" fill="url(#grid)" />

                {/* India outline (stylized) */}
                <path
                    d={INDIA_PATH}
                    fill="#FAF9F6"
                    stroke="#0A192F"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
                <path
                    d={INDIA_PATH}
                    fill="none"
                    stroke="#0A192F"
                    strokeWidth="0.8"
                    strokeDasharray="4 6"
                    opacity="0.3"
                    transform="translate(6,6)"
                />

                {/* State markers */}
                {STATE_MARKERS.map((m) => {
                    const size = getMarkerSize(m.issues);
                    const color = getMarkerColor(m);
                    const isHovered = hovered === m.state || activeState === m.state;
                    return (
                        <g
                            key={m.state}
                            transform={`translate(${m.x}, ${m.y})`}
                            className="cursor-pointer"
                            onMouseEnter={() => setHovered(m.state)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => onStateClick && onStateClick(m)}
                            data-testid={`map-marker-${m.state.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                            <circle r={size + 10} fill={color} opacity="0.15">
                                <animate
                                    attributeName="r"
                                    values={`${size};${size + 18};${size}`}
                                    dur="2.6s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="opacity"
                                    values="0.3;0;0.3"
                                    dur="2.6s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                            <circle
                                r={size}
                                fill={color}
                                stroke="#0A192F"
                                strokeWidth={isHovered ? 3 : 1.5}
                                opacity={isHovered ? 1 : 0.88}
                            />
                            <text
                                y={-size - 6}
                                textAnchor="middle"
                                fontSize={isHovered ? 18 : 13}
                                fontWeight="700"
                                fontFamily="Plus Jakarta Sans, sans-serif"
                                fill="#0A192F"
                                style={{ pointerEvents: "none" }}
                            >
                                {m.state}
                            </text>
                            {isHovered && (
                                <g>
                                    <rect
                                        x={-70}
                                        y={size + 10}
                                        width={140}
                                        height={54}
                                        fill="#0A192F"
                                        rx="4"
                                    />
                                    <text
                                        x={0}
                                        y={size + 30}
                                        textAnchor="middle"
                                        fontSize="12"
                                        fontWeight="700"
                                        fontFamily="JetBrains Mono, monospace"
                                        fill="#FF9933"
                                    >
                                        {m.issues.toLocaleString()} issues
                                    </text>
                                    <text
                                        x={0}
                                        y={size + 48}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fontFamily="Plus Jakarta Sans, sans-serif"
                                        fill="#FFFFFF"
                                    >
                                        {Math.round((m.resolved / m.issues) * 100)}% resolved
                                    </text>
                                </g>
                            )}
                        </g>
                    );
                })}
            </svg>
            <div className="absolute bottom-4 right-4 bg-white border border-[#0A192F]/15 rounded-md p-3 text-[10px] font-mono uppercase tracking-widest space-y-1.5 shadow-sm">
                <div className="text-[#0A192F] font-bold">Density</div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" /> Low
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FF9933]" /> Medium
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-600" /> High
                </div>
            </div>
        </div>
    );
};

export default IndiaMap;
