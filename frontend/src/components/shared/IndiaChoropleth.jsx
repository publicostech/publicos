import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, GeoJSON, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { STATE_MARKERS } from "../../lib/mockData";

// Heat palette: deep green (best) → saffron → deep red (worst)
const HEAT_BUCKETS = [
    { max: 1500, fill: "#14532d", label: "Minimal" },      // deep green
    { max: 4000, fill: "#16a34a", label: "Low" },          // green
    { max: 7000, fill: "#fbbf24", label: "Moderate" },     // amber
    { max: 10000, fill: "#FF9933", label: "High" },        // saffron
    { max: 999999, fill: "#b91c1c", label: "Critical" },   // deep red
];

const colorForIssues = (count) => HEAT_BUCKETS.find((b) => count <= b.max)?.fill || "#64748b";

// Map GeoJSON ST_NM → our data (handle a couple of variations)
const matchState = (gjName) => {
    const alias = {
        "Jammu & Kashmir": "Jammu & Kashmir",
        "NCT of Delhi": "Delhi",
    };
    const key = alias[gjName] || gjName;
    return STATE_MARKERS.find((s) => s.state === key);
};

const FitToIndia = ({ trigger }) => {
    const map = useMap();
    useEffect(() => {
        const fit = () => {
            map.invalidateSize();
            map.fitBounds(
                [
                    [6.5, 68.0],
                    [35.5, 97.5],
                ],
                { padding: [6, 6] }
            );
        };
        fit();
        const t = setTimeout(fit, 200);
        const obs = new ResizeObserver(fit);
        obs.observe(map.getContainer());
        return () => {
            clearTimeout(t);
            obs.disconnect();
        };
    }, [map, trigger]);
    return null;
};

export const IndiaChoropleth = ({
    height = 500,
    showLabels = true,
    showTiles = false,
    onStateClick,
}) => {
    const [geo, setGeo] = useState(null);
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        fetch("/india-states.geojson")
            .then((r) => r.json())
            .then(setGeo)
            .catch(() => setGeo(null));
    }, []);

    const style = useMemo(
        () => (feature) => {
            const name = feature.properties.ST_NM;
            const data = matchState(name);
            const fill = data ? colorForIssues(data.issues) : "#cbd5e1";
            const isHovered = hovered === name;
            return {
                fillColor: fill,
                weight: isHovered ? 2.5 : 1,
                color: isHovered ? "#0A192F" : "#FAF9F6",
                fillOpacity: isHovered ? 0.95 : 0.85,
            };
        },
        [hovered]
    );

    const onEachFeature = (feature, layer) => {
        const name = feature.properties.ST_NM;
        const data = matchState(name);

        layer.on({
            mouseover: (e) => {
                setHovered(name);
                e.target.bringToFront();
            },
            mouseout: () => setHovered(null),
            click: () => {
                if (onStateClick && data) onStateClick(data);
            },
        });

        if (showLabels) {
            layer.bindTooltip(
                `<div style="font-family:Manrope;font-size:10px;font-weight:700;color:#0A192F;text-shadow:0 1px 2px rgba(255,255,255,0.9), 0 0 4px rgba(255,255,255,0.9);">${name}</div>`,
                {
                    permanent: true,
                    direction: "center",
                    className: "state-label-tooltip",
                    opacity: 1,
                }
            );
        }
    };

    return (
        <div
            style={{ height }}
            className="relative rounded-md overflow-hidden"
            data-testid="india-choropleth"
        >
            <MapContainer
                center={[22.5, 82]}
                zoom={5}
                minZoom={4}
                maxZoom={10}
                zoomSnap={0.25}
                zoomDelta={0.5}
                scrollWheelZoom={true}
                doubleClickZoom={true}
                dragging={true}
                zoomControl={true}
                attributionControl={false}
                style={{ height: "100%", width: "100%", background: "#FAF9F6" }}
            >
                {showTiles && (
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                )}
                {geo && (
                    <GeoJSON
                        key="india-states"
                        data={geo}
                        style={style}
                        onEachFeature={onEachFeature}
                    />
                )}
                <FitToIndia trigger={!!geo} />
            </MapContainer>

            {/* Hovered state tooltip card — bottom-left so it doesn't hide the map */}
            {hovered && matchState(hovered) && (
                <div className="absolute bottom-4 left-4 bg-white border border-[#0A192F]/15 rounded-md px-4 py-3 shadow-lg z-[500] min-w-[180px]">
                    <div className="overline text-[#FF9933] mb-1">{hovered}</div>
                    <div className="font-mono text-lg font-bold text-[#0A192F]">
                        {matchState(hovered).issues.toLocaleString()} issues
                    </div>
                    <div className="text-xs text-emerald-700 font-mono mt-0.5">
                        {Math.round((matchState(hovered).resolved / matchState(hovered).issues) * 100)}% resolved
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white border border-[#0A192F]/15 rounded-md p-3 text-[10px] font-mono uppercase tracking-widest space-y-1.5 shadow-sm z-[500]">
                <div className="text-[#0A192F] font-bold mb-1">Issue density</div>
                {HEAT_BUCKETS.map((b) => (
                    <div key={b.label} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm" style={{ background: b.fill }} />
                        {b.label}
                    </div>
                ))}
            </div>

            {/* Hint */}
            <div className="absolute top-4 left-4 bg-[#0A192F]/85 text-white text-[10px] font-mono uppercase tracking-widest px-2.5 py-1.5 rounded shadow z-[500]">
                Scroll to zoom · drag to pan
            </div>
        </div>
    );
};

export default IndiaChoropleth;
