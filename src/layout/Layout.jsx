import { Outlet, NavLink, useLocation } from "react-router-dom";
import "./layout.css";

const Layout = () => {
  const location = useLocation();

  return (
  <div className="layout-root">
      <div className="layout-menu">
        <h3>Menu</h3>
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
        <Outlet />
      </div>
    </div>
  )
}

export default Layout