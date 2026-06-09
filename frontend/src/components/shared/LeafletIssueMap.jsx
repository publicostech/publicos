import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { ISSUES, STATE_MARKERS } from "../../lib/mockData";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const photoUrl = (p) => (p?.startsWith?.("http") ? p : `${BACKEND}${p || ""}`);

// Fix default marker icons in webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const STATUS_COLORS = {
    submitted: "#64748b",
    under_review: "#3B82F6",
    assigned: "#F59E0B",
    in_progress: "#FF9933",
    resolved: "#138808",
    rejected: "#dc2626",
    closure_requested: "#d97706",
    closed: "#0A192F",
};

const makeIssueIcon = (status) => {
    const color = STATUS_COLORS[status] || "#64748b";
    return L.divIcon({
        className: "civic-marker",
        html: `<div class="civic-marker-pulse" style="color:${color};background:${color}"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
    });
};

const makeStateIcon = (marker) => {
    const resolvedPct = (marker.resolved / marker.issues) * 100;
    const color = resolvedPct > 70 ? "#138808" : resolvedPct > 55 ? "#FF9933" : "#dc2626";
    const size = marker.issues > 8000 ? 46 : marker.issues > 4000 ? 40 : 34;
    const label = marker.issues >= 1000 ? `${Math.round(marker.issues / 1000)}K` : marker.issues;
    return L.divIcon({
        className: "civic-marker",
        html: `<div class="civic-marker-pin" style="background:${color};width:${size}px;height:${size}px;">${label}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
};

// Custom cluster icon — saffron pill with count
const createClusterIcon = (cluster) => {
    const count = cluster.getChildCount();
    const size = count >= 100 ? 56 : count >= 20 ? 48 : 40;
    const fontSize = count >= 100 ? 14 : 13;
    const color = count >= 100 ? "#dc2626" : count >= 20 ? "#FF9933" : "#0A192F";
    return L.divIcon({
        className: "civic-cluster",
        html: `<div class="civic-cluster-bubble" style="--c:${color};width:${size}px;height:${size}px;font-size:${fontSize}px">${count}</div>`,
        iconSize: L.point(size, size, true),
    });
};

// Adapt either mock-style issue OR backend issue into a uniform shape
const normaliseIssue = (i) => {
    if (i.location && typeof i.location === "object") {
        // Mock data format already has {location:{lat,lng,city,state}}
        return {
            id: i.id || i.issue_id,
            title: i.title,
            status: i.status,
            category: i.category,
            lat: i.location.lat,
            lng: i.location.lng,
            city: i.location.city,
            state: i.location.state,
            photo: i.photos?.[0],
            upvotes: i.upvotes ?? 0,
        };
    }
    return null;
};

export const LeafletIssueMap = ({
    view = "issues",
    categoryFilter = "all",
    onStateClick,
    height = 580,
    customIssues = null, // backend issues — if provided, overrides mock ISSUES
    enableClustering = true,
}) => {
    const issues = useMemo(() => {
        const source = customIssues || ISSUES;
        return source
            .map(normaliseIssue)
            .filter((i) => i && i.lat && i.lng && (categoryFilter === "all" || i.category === categoryFilter));
    }, [categoryFilter, customIssues]);

    const renderedMarkers = (
        <>
            {issues.map((i) => (
                <Marker
                    key={i.id}
                    position={[i.lat, i.lng]}
                    icon={makeIssueIcon(i.status)}
                >
                    <Popup maxWidth={320}>
                        <div className="w-[280px]">
                            {i.photo && (
                                <img
                                    src={photoUrl(i.photo)}
                                    alt=""
                                    className="w-full h-32 object-cover rounded-t-md"
                                />
                            )}
                            <div className="p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                                        style={{
                                            background: (STATUS_COLORS[i.status] || "#64748b") + "22",
                                            color: STATUS_COLORS[i.status] || "#64748b",
                                        }}
                                    >
                                        {i.status?.replace("_", " ")}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400">#{i.id}</span>
                                </div>
                                <div className="font-serif text-base leading-tight text-[#0A192F] mb-2">
                                    {i.title}
                                </div>
                                <div className="text-[11px] text-slate-500 mb-3">
                                    {i.city}, {i.state}
                                    <span className="mx-1.5">·</span>
                                    <span className="font-mono">{(i.upvotes || 0).toLocaleString()} support</span>
                                </div>
                                <Link
                                    to={`/issue/${i.id}`}
                                    className="inline-block bg-[#0A192F] text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#FF9933]"
                                >
                                    View details →
                                </Link>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );

    return (
        <div style={{ height }} className="relative rounded-md overflow-hidden" data-testid="leaflet-map">
            <MapContainer
                center={[22.5, 80]}
                zoom={5}
                minZoom={4}
                maxZoom={18}
                scrollWheelZoom={true}
                zoomControl={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position="bottomright" />

                {view === "states" &&
                    STATE_MARKERS.map((m) => (
                        <Marker
                            key={m.state}
                            position={[m.lat, m.lng]}
                            icon={makeStateIcon(m)}
                            eventHandlers={{
                                click: () => onStateClick && onStateClick(m),
                            }}
                        >
                            <Popup>
                                <div className="p-3 min-w-[200px]">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#FF9933] mb-1">State drill-down</div>
                                    <div className="font-serif text-xl text-[#0A192F] mb-2">{m.state}</div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <div className="text-slate-500">Open</div>
                                            <div className="font-mono font-bold">{m.issues.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-500">Resolved</div>
                                            <div className="font-mono font-bold text-emerald-700">
                                                {Math.round((m.resolved / m.issues) * 100)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                {view === "issues" && (
                    enableClustering ? (
                        <MarkerClusterGroup
                            chunkedLoading
                            iconCreateFunction={createClusterIcon}
                            showCoverageOnHover={false}
                            spiderfyOnMaxZoom={true}
                            maxClusterRadius={55}
                        >
                            {renderedMarkers}
                        </MarkerClusterGroup>
                    ) : renderedMarkers
                )}

                {view === "heat" &&
                    STATE_MARKERS.map((m) => {
                        const rate = m.resolved / m.issues;
                        const radius = 12 + Math.sqrt(m.issues) / 8;
                        const color = rate > 0.7 ? "#138808" : rate > 0.55 ? "#FF9933" : "#dc2626";
                        return (
                            <CircleMarker
                                key={m.state}
                                center={[m.lat, m.lng]}
                                radius={radius}
                                pathOptions={{
                                    color,
                                    fillColor: color,
                                    fillOpacity: 0.35,
                                    weight: 2,
                                }}
                            >
                                <Popup>
                                    <div className="p-2">
                                        <div className="font-serif text-base">{m.state}</div>
                                        <div className="text-xs text-slate-500 font-mono">
                                            {m.issues.toLocaleString()} issues · {Math.round(rate * 100)}% resolved
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        );
                    })}
            </MapContainer>
        </div>
    );
};

export default LeafletIssueMap;
