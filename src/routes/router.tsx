import { createBrowserRouter, Outlet, useNavigate } from "react-router-dom";
import { Dashboard, Login, Acervo, Emprestimos, Atrasos, Relatorios, Perfil, Configuracao } from "../pages";
import { useEffect, useState } from "react";
import { HasEnvBypass } from "../service/authService";
import { canAccessRoute } from "../service/routerService";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";

function ProtectedLayout() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const envBypass = await HasEnvBypass();

      if (envBypass) {
        console.log("EnvBypass active — skipping backend route check.");
        setIsAuthorized(true);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token - redirecting to login");
        navigate("/login", { replace: true });
        return;
      }

      const path = window.location.pathname;
      const allowed = await canAccessRoute(path);
      setIsAuthorized(allowed);

      if (!allowed) {
        console.log("Access denied - redirecting to login");
        navigate("/login", { replace: true });
      }
    };

    checkAccess();
  }, [navigate]);

  if (isAuthorized === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Header />
        <div style={{ marginTop: "60px", padding: "1rem" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    element: <ProtectedLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/acervo", element: <Acervo /> },
      { path: "/emprestimos", element: <Emprestimos /> },
      { path: "/atrasos", element: <Atrasos /> },
      { path: "/relatorios", element: <Relatorios /> },
      { path: "/perfil", element: <Perfil /> },
      { path: "/configuracao", element: <Configuracao /> },
    ],
  },
]);