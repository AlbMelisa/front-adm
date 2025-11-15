import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
// 1. Importamos el ícono del gimnasio
// import { FaDumbbell } from "react-icons/fa"; // <-- Otra buena alternativa
import "./navbarcomponent.css";

const Navbarcomponent = ({ userName = "Usuario", rol = "Administrador", onLogout }) => {
  return (
    <Navbar className="navbar-gym" expand="lg">
      <Container
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        {/* IZQUIERDA: LOGO + TITULO */}
        <div className="navbar-left d-flex align-items-center">
        
          <div className="navbar-title">
            <h6 className="title">GYM SOFTWARE</h6>
            <span className="subtitle">Sistema de gestión</span>
          </div>
        </div>

        {/* CENTRO VACIO PARA MANTENER ESPACIO (opcional) */}
        <div className="navbar-center" />

        {/* DERECHA: CAJITA DE USUARIO + LOGOUT */}
        <div className="navbar-right d-flex align-items-center">
          <div className="navbar-user-box d-flex align-items-center">
            <div className="avatar-circle">
              <FaUser className="avatar-icon" />
            </div>

            <div className="user-info">
              <span className="user-name">Bienvenido {userName}</span>
              <span className="user-role">{rol}</span>
            </div>
          </div>

          {/* icono de salida separado */}
          <button
            className="logout-button"
            onClick={() => {
              if (onLogout) onLogout();
            }}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </Container>
    </Navbar>
  );
};

export default Navbarcomponent;

