import React from "react";
import { cn } from "../../lib/utils";

const STATUS_STYLES = {
    submitted: "bg-slate-200 text-slate-700 border-slate-300",
    under_review: "bg-blue-100 text-blue-900 border-blue-200",
    assigned: "bg-amber-100 text-amber-900 border-amber-200",
    in_progress: "bg-orange-100 text-orange-900 border-orange-200",
    resolved: "bg-emerald-100 text-emerald-900 border-emerald-200",
    rejected: "bg-red-100 text-red-900 border-red-200",
};

const LABELS = {
    submitted: "Submitted",
    under_review: "Under Review",
    assigned: "Assigned",
    in_progress: "In Progress",
    resolved: "Resolved",
    rejected: "Rejected",
};

export const StatusBadge = ({ status, className }) => {
    return (
        <span
            data-testid={`status-badge-${status}`}
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border font-mono tracking-tight",
                STATUS_STYLES[status] || STATUS_STYLES.submitted,
                className
            )}
        >
            <span className={cn("inline-block w-1.5 h-1.5 rounded-full",
                status === "resolved" ? "bg-emerald-600" :
                status === "in_progress" ? "bg-orange-500" :
                status === "assigned" ? "bg-amber-500" :
                status === "under_review" ? "bg-blue-600" :
                status === "rejected" ? "bg-red-600" : "bg-slate-500"
            )} />
            {LABELS[status] || status}
        </span>
    );
};

export default StatusBadge;
