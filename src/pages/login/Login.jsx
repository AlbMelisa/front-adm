import React, { useState, useContext } from "react";
import { Container, Card, Form, Button, InputGroup } from "react-bootstrap";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaDumbbell, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { AuthContext } from "../../components/authContext/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5111/api/Auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      if (!res.ok) {
        setErrorMsg("Credenciales incorrectas");
        setLoading(false);
        return;
      }

      const data = await res.json();
      const employee = data.employee?.employeeAuthenticated;

      if (!employee || !data.token) {
        setErrorMsg("Respuesta inválida del servidor");
        setLoading(false);
        return;
      }

      login(employee, data.token);
      navigate("/");
    } catch (error) {
      setErrorMsg("Error conectando al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="login-card shadow p-4 w-50">
          <Card.Body className="text-center">

            {/* ICONO PRINCIPAL */}
            <div className="login-icon-wrapper mb-3">
              <FaDumbbell className="login-main-icon" />
            </div>

            <h2 className="login-title">Iniciar Sesión</h2>
            <p className="login-subtitle mb-4">Ingresa tus credenciales para acceder</p>

            <Form onSubmit={handleLogin}>

              {/* USUARIO */}
              <Form.Label className="text-start w-100">Usuario</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <FaUser />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="tu@ejemplo.com"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </InputGroup>

              {/* CONTRASEÑA */}
              <Form.Label className="text-start w-100">Contraseña</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <FaLock />
                </InputGroup.Text>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <InputGroup.Text
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroup.Text>
              </InputGroup>

              {/* ERROR */}
              {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

              {/* BOTÓN */}
              <Button
                type="submit"
                className="w-100 mb-3 button-login"
                disabled={loading}
              >
                {loading ? "Verificando..." : "Iniciar Sesión"}
              </Button>
            </Form>

            {/* REGISTRO */}
            <p className="mt-3 small-text-login">
              Admin: Admin | Admin123
            </p>
            <p>
              Manager: sofia9 | Sofia123
            </p>
            <p>
              Tester: melisa8 | Melisa123
            </p>
            <p>
             Developer: martin10 | Martin123
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;


