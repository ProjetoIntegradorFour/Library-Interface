import { createBrowserRouter, Outlet, useNavigate } from "react-router-dom";
import { Dashboard, Login, Acervo, Emprestimos, Atrasos, Relatorios, Perfil, Configuracao } from "../pages";
import { useEffect } from "react";
import { AmILogged } from "../service/auth/authCheck";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
function ProtectedLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!AmILogged()) {
      navigate("/login", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  if (!AmILogged()) return null;
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
  )
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
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