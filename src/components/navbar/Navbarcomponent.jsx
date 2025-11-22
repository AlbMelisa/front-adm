import React, { useContext, useState, useEffect } from "react"; // Agregamos useEffect y useState
import { Navbar, Container } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import "./navbarcomponent.css";
import { AuthContext } from "../authContext/AuthContext";

const Navbarcomponent = () => {
  const { logout } = useContext(AuthContext);
  
  // Estado local para guardar los datos del usuario
  const [userData, setUserData] = useState({
    nombre: "Usuario",
    rol: "Invitado"
  });

  useEffect(() => {
    // 1. Buscamos el item 'user' que mostraste en la imagen
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        // 2. Convertimos el texto JSON a un objeto de JavaScript
        const parsedUser = JSON.parse(storedUser);

        // 3. Actualizamos el estado con los nombres exactos de TU base de datos
        // Según tu imagen: nameEmployee y rolEmployee
        setUserData({
          nombre: parsedUser.nameEmployee, 
          rol: parsedUser.rolEmployee
        });
      } catch (error) {
        console.error("Error al leer datos del usuario", error);
      }
    }
  }, []);

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

        <div className="navbar-center" />

        {/* DERECHA */}
        <div className="navbar-right d-flex align-items-center">
          <div className="navbar-user-box d-flex align-items-center">
            <div className="avatar-circle">
              <FaUser className="avatar-icon" />
            </div>

            <div className="user-info">
              {/* AQUI USAMOS LAS VARIABLES DEL ESTADO */}
              <span className="user-name mb-2">Bienvenido {userData.nombre}</span>
              <span className="user-role">{userData.rol}</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={logout}
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

