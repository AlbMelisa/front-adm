import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Home, Folder, FileText } from "lucide-react";
import "./layout.css";
import Navbarcomponent from "../components/navbar/Navbarcomponent";

const Layout = () => {
  const location = useLocation();

  return (
    <>
      <div className="layout-root">
        <div className="layout-menu">
          <h5 className="layout-title">Menu</h5>
          <nav>
            <ul>
              <li
                className={
                  location.pathname === "/" ? "menu-selected" : "option1"
                }
              >
                <div className="d-flex">
                  <Home size={20} />
                  <NavLink to="/">Inicio</NavLink>
                </div>
              </li>
              <li
                className={
                  location.pathname === "/proyectslist"
                    ? "menu-selected"
                    : "option2"
                }
              >
                <div className="d-flex">
                  <Folder size={20} />
                  <NavLink to="/proyectslist">Proyectos</NavLink>
                </div>
              </li>
              <li
                className={
                  location.pathname === "/reports"
                    ? "menu-selected-stu"
                    : "option3"
                }
              >
                <div className="d-flex">
                  <FileText size={20} />
                  <NavLink to="/reports">Reportes</NavLink>
                </div>
              </li>
            </ul>
          </nav>
        </div>
        <div className="layout-main-content">
          <Navbarcomponent />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
