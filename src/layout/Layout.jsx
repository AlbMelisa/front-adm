import { Outlet, NavLink, useLocation } from "react-router-dom";

import "./layout.css";
import Navbarcomponent from "../components/navbar/Navbarcomponent";

const Layout = () => {
  const location = useLocation();

  return (
    <>
      <div className="layout-root">
        <div className="layout-menu">
          <h5>Menu</h5>
          <nav>
            <ul>
              <li
                className={
                  location.pathname === "/" ? "menu-selected" : "option1"
                }
              >
                <NavLink to="/">Proyectos</NavLink>
              </li>
              <li
                className={
                  location.pathname === "/students"
                    ? "menu-selected-stu"
                    : "option2"
                }
              >
                <NavLink to="/students">Reportes</NavLink>
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
