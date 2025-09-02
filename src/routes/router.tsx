import { createBrowserRouter, Outlet } from "react-router-dom";
import Dashboard from "../pages/dashboard/dashboard";
import Login from "../pages/login/login";
import Acervo from "../pages/acervo/acervo";
import Emprestimos from "../pages/emprestimos/emprestimos";
import Atrasos from "../pages/atrasos/atrasos";
import Relatorios from "../pages/relatorios/relatorios";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";

function ProtectedLayout() {
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
    ],
  },
]);
