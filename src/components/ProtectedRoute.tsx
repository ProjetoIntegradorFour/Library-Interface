import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../service/authService";
import { canAccessRoute } from "../service/routeGuards";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const currentPath = window.location.pathname;

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (!canAccessRoute(currentPath)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;