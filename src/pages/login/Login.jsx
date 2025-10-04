import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { FaUser, FaLock, FaRegUser } from 'react-icons/fa'; // Importa los iconos necesarios
import { useNavigate } from 'react-router-dom'; // Para la redirección después del login
import '../login/login.css'

const Login = () => {
   const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Usuario:', username, 'Contraseña:', password);

    // Aquí iría tu lógica de autenticación real (llamada a API, etc.)
    // Por ahora, simulamos un login exitoso y redirigimos
    if (username === 'test' && password === 'password') {
      alert('¡Login exitoso!');
      // Redirige al usuario a la página principal después del login
      navigate('/'); 
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };
  return (
      <div className="login-page-container"> {/* Contenedor para el fondo y centrado */}
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="login-card shadow p-4"> {/* Card con sombra y padding */}
          <Card.Body className="text-center">
            
            {/* Logo o Icono Principal */}
            <div className="login-logo-container mb-3">
              {/* Puedes usar una imagen aquí <img src="tu_logo.png" alt="SS Mobile Logo" className="login-logo" /> */}
              {/* O un div placeholder como en el Navbar anterior, o iconos */}
              <div className="login-logo-icon">
                {/* Ícono de "SS Mobile" */}
                {/* Simulamos el icono de las flechas con CSS */}
              </div>
            </div>
            <Card.Title className="mb-4">SS Mobile</Card.Title>
            <h4 className="mb-4">Iniciar Sesión</h4>

            {/* Formulario de Login */}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Usuario</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Ingresa tu usuario" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Ingresa tu contraseña" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mb-3">
                Iniciar Sesión
              </Button>
            </Form>

            {/* Enlace de Registro */}
            <div className="mt-4">
              <p className="small-text-login">
                <FaRegUser className="me-1" /> {/* Icono de persona para "Registrate" */}
                <a href="/register">¿No Tienes cuenta? Regístrate!</a>
              </p>
            </div>

          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default Login