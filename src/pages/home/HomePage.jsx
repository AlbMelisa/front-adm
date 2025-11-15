import { NavLink } from "react-router-dom";
import "./home.css";
import { Folder, FileText, Home, User } from "lucide-react";

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="home-header">
        <Home className="home-icon" size={64} />
        <h1>Bienvenido al Sistema de Proyectos</h1>
        <p>Selecciona una opción del menú para comenzar</p>
      </div>

      <div className="home-cards">
        <NavLink to="/proyectslist" className="card">
          <Folder className="card-icon" size={36} />
          <h2>Proyectos</h2>
          <p>Gestiona y visualiza todos tus proyectos</p>
        </NavLink>

        <NavLink to="/customers" className="card">
          <User className="card-icon" size={36} />
          <h2>Clientes</h2>
          <p>Consulta proyectos del cliente</p>
        </NavLink>

        <NavLink to="/reports" className="card">
          <FileText className="card-icon" size={36} />
          <h2>Reportes</h2>
          <p>Consulta reportes y estadísticas</p>
        </NavLink>
      </div>
    </div>
  );
};

export default HomePage;
