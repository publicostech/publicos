import React from "react";

/**
 * PublicOS official wordmark — uses the user-provided logo with transparent background.
 * `invert` swaps to the dark-mode variant (black "Public" text becomes white) for use
 * on the navy footer.
 */
export const BrandLogo = ({ height = 36, invert = false, className = "" }) => {
    const src = invert ? "/publicos-logo-dark.png" : "/publicos-logo.png";
    return (
        <img
            src={src}
            alt="PublicOS"
            height={height}
            style={{ height, width: "auto", display: "block" }}
            className={className}
            data-testid="brand-logo"
        />
    );
};

/**
 * Compact icon-only version (the orange network cluster, cropped from the wordmark).
 * Use for favicons, app icons, or tight spaces.
 */
export const BrandMark = ({ size = 36, invert = false, className = "" }) => {
    const src = invert ? "/publicos-logo-dark.png" : "/publicos-logo.png";
    return (
        <span
            className={`inline-block overflow-hidden ${className}`}
            style={{
                width: size,
                height: size,
                backgroundImage: `url(${src})`,
                backgroundSize: "auto 100%",
                backgroundPosition: "left center",
                backgroundRepeat: "no-repeat",
            }}
            aria-label="PublicOS"
        />
    );
};

export default BrandLogo;
