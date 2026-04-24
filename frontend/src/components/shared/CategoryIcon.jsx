import React from "react";
import {
    Construction, Trash2, Droplets, Lamp, Waves, HardHat, ShieldAlert,
    TrafficCone, Factory, HeartPulse, Landmark, School, ShieldCheck,
} from "lucide-react";
import { CATEGORIES } from "../../lib/mockData";

const ICON_MAP = {
    Construction, Trash2, Droplets, Lamp, Waves, HardHat, ShieldAlert,
    TrafficCone, Factory, HeartPulse, Landmark, School, ShieldCheck,
};

export const CategoryIcon = ({ categoryId, size = 18, className = "" }) => {
    const cat = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
    const Icon = ICON_MAP[cat.icon] || Construction;
    return <Icon size={size} strokeWidth={1.75} className={className} style={{ color: cat.color }} />;
};

export const CategoryChip = ({ categoryId }) => {
    const cat = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
    return (
        <span
            data-testid={`category-chip-${categoryId}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border border-[#0A192F]/10 bg-white"
        >
            <CategoryIcon categoryId={categoryId} size={13} />
            <span className="text-[#0A192F]">{cat.label}</span>
        </span>
    );
};

export default CategoryIcon;
