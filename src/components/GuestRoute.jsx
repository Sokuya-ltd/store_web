import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * GuestRoute component that redirects authenticated users to dashboard.
 * Only unauthenticated users can access these routes (login, onboarding, etc.).
 */
export default function GuestRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#D35400] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
        // Check if there's a saved location to redirect to
        const from = location.state?.from?.pathname || "/";
        return <Navigate to={from} replace />;
    }

    // Render guest routes (login, onboarding, etc.)
    return <Outlet />;
}
