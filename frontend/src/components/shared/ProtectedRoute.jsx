import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children, adminOnly = false, officialOrAdmin = false }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center" data-testid="auth-loading">
                <Loader2 className="animate-spin text-[#FF9933]" size={28} />
            </div>
        );
    }
    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    if (adminOnly && user.role !== "admin") {
        return <Navigate to="/me" replace />;
    }
    if (officialOrAdmin && user.role !== "admin" && user.role !== "official") {
        return <Navigate to="/me" replace />;
    }
    return children;
};

export default ProtectedRoute;
