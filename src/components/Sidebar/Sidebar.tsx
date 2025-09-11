import { NavLink } from "react-router-dom";
import "./Sidebar.css";

import dashboardIcon from "../../assets/img/dashboard.png";
import acervoIcon from "../../assets/img/book.png";
import emprestimosIcon from "../../assets/img/user.png";
import atrasosIcon from "../../assets/img/money.png";
import relatoriosIcon from "../../assets/img/document.png";
import perfilIcon from "../../assets/img/perfil.png";
import configIcon from "../../assets/img/configuracoes.png";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink
        to="/"
        className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
      >
        <img src={dashboardIcon} alt="Dashboard" className="icon" />
        Dashboard
      </NavLink>

      <NavLink
        to="/acervo"
        className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
      >
        <img src={acervoIcon} alt="Acervo" className="icon" />
        Acervo
      </NavLink>

      <NavLink
        to="/emprestimos"
        className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
      >
        <img src={emprestimosIcon} alt="Empréstimos" className="icon" />
        Empréstimos
      </NavLink>

      <NavLink
        to="/atrasos"
        className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
      >
        <img src={atrasosIcon} alt="Atrasos/Pagamentos" className="icon" />
        Atrasos/Pagamentos
      </NavLink>

      <NavLink
        to="/relatorios"
        className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
      >
        <img src={relatoriosIcon} alt="Relatórios" className="icon" />
        Relatórios
      </NavLink>
 
      <div className="menu-bottom">
        <NavLink
          to="/perfil"
          className={({ isActive }) => `mini-item ${isActive ? "active" : ""}`}
        >
          <img src={perfilIcon} alt="Perfil" className="mini-icon" />
        </NavLink>

        <NavLink
          to="/configuracao"
          className={({ isActive }) => `mini-item ${isActive ? "active" : ""}`}
        >
          <img src={configIcon} alt="Configurações" className="mini-icon" />
        </NavLink>
      </div>
      </aside>  
  );
}


