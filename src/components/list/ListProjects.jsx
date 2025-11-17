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

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  const proyectosPorPagina = 5;

  // Obtener proyectos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true);
        const response = await fetch("http://localhost:3001/Projects");
        // const response = await fetch("http://localhost:3001/Projects/getAllProyects");
        
        const data = await response.json();
        setProyectos(data);
      } catch (error) {
        console.error("Error al obtener los proyectos:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  const proyectosFiltrados = proyectos.filter(
    (p) =>
      p.nameProject?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.idProyecto?.toString().includes(busqueda)
  );

  const indexUltimo = paginaActual * proyectosPorPagina;
  const indexPrimero = indexUltimo - proyectosPorPagina;
  const proyectosPagina = proyectosFiltrados.slice(indexPrimero, indexUltimo);

  const totalPaginas = Math.ceil(proyectosFiltrados.length / proyectosPorPagina);

  const handlePagina = (numero) => setPaginaActual(numero);

  const handleEstadoChange = async (projectId, nuevoEstado) => {
    try {
      const response = await fetch(
        `http://localhost:3001/proyectos/${projectId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estadoProyecto: nuevoEstado }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el estado");

      const actualizado = await response.json();

      setProyectos((prev) =>
        prev.map((p) =>
          p.idProyecto === projectId ? actualizado : p
        )
      );
    } catch (error) {
      console.error("Error al guardar el estado:", error);
    }
  };

  // --- MANEJO DEL MODAL ---
  const handleShowUpdateModal = (proyecto) => {
    setProyectoSeleccionado(proyecto);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setProyectoSeleccionado(null);
  };

  // Recibir cambios desde el modal
  const handleUpdateLocal = (proyectoActualizado) => {
    setProyectos((prev) =>
      prev.map((p) =>
        p.idProject === proyectoActualizado.idProject
          ? proyectoActualizado
          : p
      )
    );
  };
const traduccionesEstado = {
  'Planning': 'En Planificación',
  'In_Progress': 'En Curso',
  'Finished': 'Terminado',
  'Completed': 'Completado',
  'Cancelled': 'Cancelado',
  'Pending': 'Pendiente',
  // Añade cualquier otro estado que tengas
};
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
                    <td>{traduccionesEstado[project.stateProject] || project.stateProject}</td>
                    {/* <td>
                      <Form.Select
                        size="sm"
                        value={p.estadoProyecto}
                        onChange={(e) =>
                          handleEstadoChange(p.idProyecto, e.target.value)
                        }
                      >
                        <option>En Planificación</option>
                        <option>En curso</option>
                        <option>Terminado</option>
                      </Form.Select>
                    </td> */}

                    <td>{project.teamNumber}</td>

                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="warning" size="sm">
                          Opciones
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                              key={`${project.idProject}-edit`}

                            onClick={() =>
                              navigate(`/projectslist/project/${project.idProject}`)
                            }
                          >
                            Ver detalles
                          </Dropdown.Item>

                          {/*  👉 AQUI SE ABRE EL MODAL */}
                          <Dropdown.Item key={`${project.idProject}-modify`} onClick={() => handleShowUpdateModal(project)}>
                            Modificar
                          </Dropdown.Item>
                          

                          {/*Aqui para eliminar*/}
                          <Dropdown.Item key={`${project.idProject}-delete`}>
                            <DeleteButton
                              
                              idProject={project.idProject}
                              projectName={project.nameProject}
                              onDelete={setProyectos}
                            />
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <h3>No existen proyectos cargados aún.</h3>
                    <p>Crea un nuevo proyecto para verlo aquí.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}

      {/*  --- MODAL DE ACTUALIZACIÓN --- */}
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

export default ListProjects;