import React, { useState, useEffect } from "react";
import {
  Table,
  Pagination,
  Dropdown,
  Form,
  Spinner,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DeleteButton from "../deleteButton/DeleteButton";
import ModalProject from "../modalProject/ModalProject";

const ListProjects = () => {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  const proyectosPorPagina = 5;

  // Función para verificar si el token es válido
  const verifyToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        isValid: false,
        message: "No hay token de autenticación. Por favor, inicia sesión.",
      };
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("token"); // Limpiar token expirado
        return {
          isValid: false,
          message: "El token ha expirado. Por favor, inicia sesión nuevamente.",
        };
      }

      return { isValid: true };
    } catch (parseError) {
      localStorage.removeItem("token"); // Limpiar token inválido
      return {
        isValid: false,
        message: "Token inválido. Por favor, inicia sesión nuevamente.",
      };
    }
  };

  // Obtener proyectos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true);
        setError(null);
        const storedUserString = localStorage.getItem("user"); // 1. Obtienes el texto

        if (storedUserString) {
          const storedUser = JSON.parse(storedUserString); // 2. Lo conviertes a Objeto JSON

          if (storedUser && storedUser.rolEmployee) {
            setUserRole(storedUser.rolEmployee);
          }
        }
        const tokenValidation = verifyToken();
        if (!tokenValidation.isValid) {
          throw new Error(tokenValidation.message);
        }

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5111/api/Projects/getAllProyects",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response status:", response.status);

        if (response.status === 401) {
          localStorage.removeItem("token");
          throw new Error(
            "Sesión expirada. Por favor, inicia sesión nuevamente."
          );
        }

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Datos recibidos:", data);

        // Usar la propiedad correcta según la estructura que me mostraste
        if (data.proyectsList && Array.isArray(data.proyectsList)) {
          setProyectos(data.proyectsList);
        } else if (Array.isArray(data)) {
          setProyectos(data);
        } else {
          console.warn(
            "Estructura de respuesta inesperada, usando array vacío"
          );
          setProyectos([]);
        }
      } catch (error) {
        console.error("Error al obtener los proyectos:", error);
        setError(error.message);
        setProyectos([]);

        // Redirigir inmediatamente si es error de autenticación
        if (
          error.message.includes("token") ||
          error.message.includes("sesión") ||
          error.message.includes("inicia sesión")
        ) {
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Funciones para el modal (agregar estas que faltan)
  const handleShowUpdateModal = (project) => {
    setProyectoSeleccionado(project);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setProyectoSeleccionado(null);
  };

  const handleUpdateLocal = (updatedProject) => {
    setProyectos((prev) =>
      prev.map((project) =>
        project.idProject === updatedProject.idProject
          ? updatedProject
          : project
      )
    );
  };
const handleDeleteProject = (deletedProjectId) => {
  setProyectos(prevProyectos => 
    prevProyectos.filter(project => project.idProject !== deletedProjectId)
  );
};
  // Asegurar que proyectos siempre sea un array antes de usar filter
  const proyectosFiltrados = Array.isArray(proyectos)
    ? proyectos.filter(
        (p) =>
          p.nameProject?.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.idProyecto?.toString().includes(busqueda) ||
          p.idProject?.toString().includes(busqueda)
      )
    : [];

  const indexUltimo = paginaActual * proyectosPorPagina;
  const indexPrimero = indexUltimo - proyectosPorPagina;
  const proyectosPagina = proyectosFiltrados.slice(indexPrimero, indexUltimo);

  const totalPaginas = Math.ceil(
    proyectosFiltrados.length / proyectosPorPagina
  );

  const handlePagina = (numero) => setPaginaActual(numero);

  // Estado de depuración MEJORADO
  if (error) {
    const isAuthError =
      error.includes("token") ||
      error.includes("sesión") ||
      error.includes("inicia sesión");

    return (
      <div className="container mt-4">
        <div
          className={`alert ${isAuthError ? "alert-warning" : "alert-danger"}`}
        >
          <h4>
            {isAuthError
              ? "Error de Autenticación"
              : "Error al cargar proyectos"}
          </h4>
          <p>{error}</p>
          <div className="mt-3">
            {isAuthError ? (
              <>
                <p>Redirigiendo al login en 2 segundos...</p>
                <Button variant="primary" onClick={() => navigate("/login")}>
                  Ir al Login Ahora
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Form.Control
        type="text"
        placeholder="Buscar por nombre o ID"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="mb-3"
      />

      {cargando ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando proyectos...</p>
        </div>
      ) : (
        <>
          <Table bordered hover responsive>
            <thead>
              <tr className="text-center">
                <th>ID</th>
                <th>Proyecto</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Equipo</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {proyectosPagina.length > 0 ? (
                proyectosPagina.map((project) => (
                  <tr className="text-center" key={project.idProject}>
                    <td>{project.idProject}</td>
                    <td>{project.nameProject}</td>
                    <td>{project.clientName}</td>
                    <td>
                      {traduccionesEstado[project.stateProject] ||
                        project.stateProject}
                    </td>
                    <td>{project.teamNumber}</td>

                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="warning" size="sm">
                          Opciones
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() =>
                              navigate(`/projectslist/${project.idProject}`)
                            }
                          >
                            Ver detalles
                          </Dropdown.Item>

                          {["Administrator"].includes(userRole) && (
                            <div>
                              <Dropdown.Item
                                onClick={() => handleShowUpdateModal(project)}
                              >
                                Modificar
                              </Dropdown.Item>
                            <Dropdown.Item>
                              <DeleteButton
                                idProject={project.idProject}
                                projectName={project.nameProject}
                                onDelete={handleDeleteProject}
                              />
                            </Dropdown.Item>
                            <Dropdown.Item
                            onClick={() =>
                              navigate(`/projectslist/history/${project.idProject}`)
                            }
                            >
                              Historial
                              
                            </Dropdown.Item>
                            </div>
                          )}

                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    {proyectos.length === 0 ? (
                      <>
                        <h3>No existen proyectos cargados aún.</h3>
                        <p>Crea un nuevo proyecto para verlo aquí.</p>
                      </>
                    ) : (
                      <>
                        <h3>No se encontraron proyectos.</h3>
                        <p>Intenta con otros términos de búsqueda.</p>
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {proyectosFiltrados.length > 0 && (
            <Pagination className="justify-content-center">
              <Pagination.Prev
                disabled={paginaActual === 1}
                onClick={() => handlePagina(paginaActual - 1)}
              />

              {[...Array(totalPaginas)].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === paginaActual}
                  onClick={() => handlePagina(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next
                disabled={paginaActual === totalPaginas}
                onClick={() => handlePagina(paginaActual + 1)}
              />
            </Pagination>
          )}
        </>
      )}

      {proyectoSeleccionado && (
        <ModalProject
          show={showUpdateModal}
          handleClose={handleCloseUpdateModal}
          project={proyectoSeleccionado}
          onUpdate={handleUpdateLocal}
        />
      )}
    </div>
  );
};

const traduccionesEstado = {
  Planning: "En Planificación",
  In_Progress: "En Curso",
  Finished: "Terminado",
  Completed: "Completado",
  Cancelled: "Cancelado",
  Pending: "Pendiente",
  Progress: "En Progreso", // Agregado según tu respuesta de la API
};

export default ListProjects;
