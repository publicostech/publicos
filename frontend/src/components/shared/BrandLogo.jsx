import React from "react";

/**
 * PublicOS logo mark — a civic monument/institution symbol inside a rounded navy chip,
 * with a saffron base stripe evoking the Indian tricolor and civic authority.
 */
export const BrandMark = ({ size = 36, invert = false }) => {
    const bg = invert ? "#FFFFFF" : "#0A192F";
    const stroke = invert ? "#0A192F" : "#FFFFFF";
    const accent = "#FF9933";
    const s = size;

    return (
        <svg
            width={s}
            height={s}
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="PublicOS mark"
            className="shrink-0"
        >
            {/* Base navy chip */}
            <rect x="1" y="1" width="38" height="38" rx="8" fill={bg} />
            {/* Saffron base stripe */}
            <rect x="1" y="32" width="38" height="7" rx="0" fill={accent} />
            {/* Pediment (triangle roof) */}
            <path
                d="M 10 15 L 20 9 L 30 15 Z"
                fill="none"
                stroke={stroke}
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            {/* Horizontal lintel under roof */}
            <line x1="9" y1="16.5" x2="31" y2="16.5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            {/* Three pillars */}
            <line x1="13" y1="17.5" x2="13" y2="28" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            <line x1="20" y1="17.5" x2="20" y2="28" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            <line x1="27" y1="17.5" x2="27" y2="28" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            {/* Base plinth */}
            <line x1="9" y1="29" x2="31" y2="29" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
};

/**
 * Wordmark block for header / footer
 */
export const BrandLogo = ({ size = 36, invert = false, subtitle = "PUBLIC PORTAL · INDIA" }) => (
    <div className="flex items-center gap-3">
        <BrandMark size={size} invert={invert} />
        <div className="leading-none">
            <div
                className="font-serif text-[1.4rem] font-semibold tracking-tight"
                style={{
                    fontFamily: "'Fraunces', serif",
                    color: invert ? "#FFFFFF" : "#0A192F",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                }}
            >
                Public<span style={{ color: "#FF9933", fontStyle: "italic" }}>OS</span>
            </div>
            <div
                className="text-[9px] font-bold uppercase mt-1.5"
                style={{
                    letterSpacing: "0.22em",
                    fontFamily: "'Manrope', sans-serif",
                    color: invert ? "rgba(255,255,255,0.6)" : "#64748b",
                }}
            >
                {subtitle}
            </div>
        </div>
    </div>
);

export default BrandLogo;
