import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

const pinIcon = L.divIcon({
    className: "civic-marker",
    html: `<div class="civic-marker-pin" style="background:#FF9933;width:28px;height:28px;"><span style="font-family:Plus Jakarta Sans, sans-serif;font-size:14px">●</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
});

export const LocationPreview = ({ lat, lng, height = 180 }) => {
    if (!lat || !lng) return null;
    return (
        <div style={{ height }} className="rounded-md overflow-hidden border border-[#0A192F]/10" data-testid="location-preview-map">
            <MapContainer
                center={[lat, lng]}
                zoom={15}
                scrollWheelZoom={false}
                zoomControl={false}
                dragging={false}
                doubleClickZoom={false}
                attributionControl={false}
                style={{ height: "100%", width: "100%" }}
                key={`${lat}-${lng}`}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]} icon={pinIcon} />
            </MapContainer>
        </div>
    );
};

export default LocationPreview;
