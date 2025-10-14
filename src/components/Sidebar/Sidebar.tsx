import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { fetchAllowedRoutes } from "../../service/routerService";
import { HasEnvBypass } from "../../service/authService";
import "./Sidebar.css";

import dashboardIcon from "../../assets/img/dashboard.png";
import acervoIcon from "../../assets/img/book.png";
import emprestimosIcon from "../../assets/img/user.png";
import atrasosIcon from "../../assets/img/money.png";
import relatoriosIcon from "../../assets/img/document.png";
import perfilIcon from "../../assets/img/perfil.png";
import configIcon from "../../assets/img/configuracoes.png";

const allRoutes = [
  { path: "/", label: "Dashboard", icon: dashboardIcon },
  { path: "/acervo", label: "Acervo", icon: acervoIcon },
  { path: "/emprestimos", label: "Empréstimos", icon: emprestimosIcon },
  { path: "/atrasos", label: "Atrasos/Pagamentos", icon: atrasosIcon },
  { path: "/relatorios", label: "Relatórios", icon: relatoriosIcon },
  { path: "/perfil", label: "Perfil", icon: perfilIcon },
  { path: "/configuracao", label: "Configurações", icon: configIcon },
];

export default function Sidebar() {
  const [allowed, setAllowed] = useState<string[]>([]);

  useEffect(() => {
    const loadAllowed = async () => {
      const envBypass = await HasEnvBypass();

      if (envBypass) {
        console.log("⚙️ EnvBypass active — showing all routes.");
        setAllowed(allRoutes.map((r) => r.path));
      } else {
        const routes = await fetchAllowedRoutes();
        setAllowed(routes);
      }
    };

    loadAllowed();
  }, []);

  return (
    <aside className="sidebar">
      {allRoutes
        .filter((route) => allowed.includes(route.path))
        .map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <img src={route.icon} alt={route.label} className="icon" />
            {route.label}
          </NavLink>
        ))}
    </aside>
  );
}
