import { NavLink } from "react-router-dom";
import { getAccessibleRoutes } from "../../service/routeGuards";

import dashboardIcon from "../../assets/img/dashboard.png";
import acervoIcon from "../../assets/img/book.png";
import emprestimosIcon from "../../assets/img/user.png";
import atrasosIcon from "../../assets/img/money.png";
import relatoriosIcon from "../../assets/img/document.png";
import perfilIcon from "../../assets/img/perfil.png";
import configIcon from "../../assets/img/configuracoes.png";

export default function Sidebar() {
  const accessibleRoutes = getAccessibleRoutes();

  const shouldShowRoute = (path: string): boolean => {
    return accessibleRoutes.includes(path);
  };

  return (
    <aside className="sidebar">
      {shouldShowRoute("/") && (
        <NavLink
          to="/"
          className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
        >
          <img src={dashboardIcon} alt="Dashboard" className="icon" />
          Dashboard
        </NavLink>
      )}

      {shouldShowRoute("/acervo") && (
        <NavLink
          to="/acervo"
          className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
        >
          <img src={acervoIcon} alt="Acervo" className="icon" />
          Acervo
        </NavLink>
      )}

      {shouldShowRoute("/emprestimos") && (
        <NavLink
          to="/emprestimos"
          className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
        >
          <img src={emprestimosIcon} alt="Empréstimos" className="icon" />
          Empréstimos
        </NavLink>
      )}

      {shouldShowRoute("/atrasos") && (
        <NavLink
          to="/atrasos"
          className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
        >
          <img src={atrasosIcon} alt="Atrasos/Pagamentos" className="icon" />
          Atrasos/Pagamentos
        </NavLink>
      )}

      {shouldShowRoute("/relatorios") && (
        <NavLink
          to="/relatorios"
          className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
        >
          <img src={relatoriosIcon} alt="Relatórios" className="icon" />
          Relatórios
        </NavLink>
      )}

      <div className="menu-bottom">
        {shouldShowRoute("/perfil") && (
          <NavLink
            to="/perfil"
            className={({ isActive }) => `mini-item ${isActive ? "active" : ""}`}
          >
            <img src={perfilIcon} alt="Perfil" className="mini-icon" />
          </NavLink>
        )}

        {shouldShowRoute("/configuracao") && (
          <NavLink
            to="/configuracao"
            className={({ isActive }) => `mini-item ${isActive ? "active" : ""}`}
          >
            <img src={configIcon} alt="Configurações" className="mini-icon" />
          </NavLink>
        )}
      </div>
    </aside>
  );
}