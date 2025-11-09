import { useState } from "react"; // 👈 Solo importamos el hook
import { NavLink, Outlet, useLocation } from "react-router-dom"; 
import Navbarcomponent from "../components/navbar/Navbarcomponent";
import "./sidebar.css";
import { Home, Folder, FileText, Menu, X } from "lucide-react";

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
            location.pathname.includes("/proyectslist")
              ? "menu-item menu-selected"
              : "menu-item"
          }
        >
          <NavLink to="/proyectslist" className="menu-link">
            <Folder size={20} />
            <span>Proyectos</span>
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
          {/* <div className="menu">
            <div className="menu-item active">
              <Home size={20} />
              <span>Inicio</span>
            </div>

            <div className="menu-item">
              <Folder size={20} />
              <span>Proyectos</span>
            </div>

            <div className="menu-item">
              <FileText size={20} />
              <span>Reportes</span>
            </div>
          </div> */}

        </nav>
      </div>

      <div className="layout-main-content">
        <Navbarcomponent />
        <Outlet />
      </div>
    </div>
  );
}
