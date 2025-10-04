import React from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import '../navbar/navbarcomponent.css'
const Navbarcomponent = ({ userName = "Mauro" }) => {
  return (
         <Navbar className="custom-navbar" expand="lg" data-bs-theme="light">
      <Container fluid className="d-flex justify-content-between align-items-center">
        
        {/* 1. Logo y Marca (Izquierda) */}
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          {/* Aquí iría tu logo, por ejemplo, un <img> */}
          <div className="logo-placeholder me-2">
            {/* Placeholder para tu logo */}
          </div>
          <span className="small-text">SS Mobile</span>
        </Navbar.Brand>
        
        {/* Usamos un <div> en lugar de Nav para centrar el mensaje de bienvenida */}
        <div className="welcome-message">
          <div className="d-flex align-items-center">
            {/* Ícono de Persona (Puedes reemplazar con un ícono real de librería) */}
            <div className="person-icon-placeholder me-2">
              {/* Icono de Persona */}
            </div>
            <span>Bienvenido **"{userName}"**</span>
          </div>
        </div>
        
        {/* 3. Cerrar Sesión (Derecha) */}
        <Nav>
          <Nav.Link href="#logout" className="logout-link d-flex align-items-center">
            {/* Ícono de Cerrar Sesión (Puedes reemplazar con un ícono real) */}
            <div className="logout-icon-placeholder me-2">
              {/* Icono de Cerrar Sesión */}
            </div>
            Cerrar Sesión
          </Nav.Link>
        </Nav>

      </Container>
    </Navbar>
  )
}

export default Navbarcomponent