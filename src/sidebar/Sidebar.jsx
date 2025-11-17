import { useState } from "react"; // 👈 Solo importamos el hook
import { NavLink, Outlet, useLocation } from "react-router-dom"; 
import Navbarcomponent from "../components/navbar/Navbarcomponent";
import "./sidebar.css";
import { Home, Folder, FileText, Menu, X, User } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="layout">
      <div className="sidebar">
        <h2 className="sidebar-title">Menú</h2>
        <nav>
           <ul className="menu">
        <li
          className={
            location.pathname === "/" ? "menu-item menu-selected" : "menu-item"
          }
        >
          <NavLink to="/" className="menu-link">
            <Home size={20} />
            <span>Inicio</span>
          </NavLink>
        </li>

        <li
          className={
            location.pathname.includes("/projectslist")
              ? "menu-item menu-selected"
              : "menu-item"
          }
        >
          <NavLink to="/projectslist" className="menu-link">
            <Folder size={20} />
            <span>Proyectos</span>
          </NavLink>
        </li>
        <li

          className={
            location.pathname.includes("/customers")
              ? "menu-item menu-selected"
              : "menu-item"
          }
        >
          <NavLink to="/customers" className="menu-link">
            <User size={20} />
            <span>Clientes</span>
          </NavLink>
        </li>
        <li
          className={
            location.pathname === "/reports"
              ? "menu-item menu-selected"
              : "menu-item"
          }
        >
          <NavLink to="/reports" className="menu-link">
            <FileText size={20} />
            <span>Reportes</span>
          </NavLink>
        </li>
      </ul>

        </nav>
      </div>

      <div className="layout-main-content">
        <Navbarcomponent />
        <Outlet />
      </div>
    </div>
  );
}
