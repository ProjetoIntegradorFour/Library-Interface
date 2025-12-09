// ProtectedRoute.tsx - VERSÃO COM LOGS DETALHADOS
import { Navigate, useLocation } from "react-router-dom";
import { HasEnvBypass, isAuthenticated } from "../service/authService";
import { canAccessRoute } from "../service/routeGuards"; 
import { useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

const ProtectedRoute = ({ 
    children, 
    requireAuth = true 
}: ProtectedRouteProps) => {
    const location = useLocation();
    const isAuth = isAuthenticated();
    const hasBypass = HasEnvBypass();

    useEffect(() => {
        console.log("=".repeat(50));
        console.log("🛡️ ProtectedRoute ANALYSIS");
        console.log("🛡️ Path:", location.pathname);
        console.log("🛡️ isAuth:", isAuth);
        console.log("🛡️ hasBypass:", hasBypass);
        console.log("🛡️ requireAuth:", requireAuth);
        console.log("=".repeat(50));
    }, [location.pathname, isAuth, hasBypass, requireAuth]);

    // 1. Verifica autenticação (se necessário)
    if (requireAuth && !isAuth && !hasBypass) {
        console.log("🔴 REDIRECT: Não autenticado → /login");
        return <Navigate to="/login" replace />;
    }

    // 2. Verifica permissões da rota específica (APENAS se autenticado)
    if (isAuth || hasBypass) {
        const hasAccess = canAccessRoute(location.pathname);
        console.log("🛡️ canAccessRoute result:", hasAccess);
        
        if (!hasAccess) {
            console.log("🔴 REDIRECT: Sem permissão → /acesso-negado");
            console.log("🔴 Current path:", location.pathname);
            console.log("🔴 User role:", /* adicione getUserRole() se possível */);
            return <Navigate to="/acesso-negado" replace />;
        }
    }

    console.log("✅ ACCESS GRANTED para:", location.pathname);
    return <>{children}</>;
};

export default ProtectedRoute;