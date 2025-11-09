import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { FaRegUserCircle } from "react-icons/fa";
import "../navbar/navbarcomponent.css";
const Navbarcomponent = ({ userName = "Usuario" }) => {
  return (
    <Navbar className="custom-navbar" expand="lg" data-bs-theme="light">
      <Container
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        {/* 1. Logo y Marca (Izquierda) */}
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          {/* Aquí iría tu logo, por ejemplo, un <img> */}
          <div className="logo-placeholder me-2">
            {/* Placeholder para tu logo */}
          </div>
          <span className="small-text">GYM SOFTWARE</span>
        </Navbar.Brand>

        {/* Usamos un <div> en lugar de Nav para centrar el mensaje de bienvenida */}
        <div className="welcome-message">
          <div className="d-flex align-items-center">
            {/* 1. Icono de Persona (FaRegUserCircle de react-icons) */}
            <FaRegUserCircle size={24} className="me-2" />

            {/* 2. Mensaje de Bienvenida al Usuario */}
            <span>Bienvenido {userName}</span>
          </div>
        </div>

        {/* 3. Cerrar Sesión (Derecha) */}
        <Nav>
          <Nav.Link
            href="#logout"
            className="logout-link d-flex align-items-center"
          >
            {/* Ícono de Cerrar Sesión (Puedes reemplazar con un ícono real) */}
            <div className="logout-icon-placeholder me-2">
              {/* Icono de Cerrar Sesión */}
            </div>
            Cerrar Sesión
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navbarcomponent;
