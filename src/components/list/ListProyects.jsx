import React, { useState, useEffect } from "react";
import {
  Table,
  Pagination,
  Dropdown,
  Form,
  Spinner,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
// import axios from "axios"; // ← si preferís usar axios

const ListProyects = () => {
  // Estado para los proyectos
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargando, setCargando] = useState(false);

  const proyectosPorPagina = 5;

  // 🔹 useEffect para cargar los datos
  useEffect(() => {
    setCargando(true);

    const fetchData = async () => {
      try {
        setCargando(true);
        const response = await fetch("http://localhost:3001/proyectos");
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

  // 🔹 Filtrar proyectos por búsqueda
  const proyectosFiltrados = proyectos.filter(
    (p) =>
      p.nombreProyecto.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.id.toString().includes(busqueda)
  );

  // 🔹 Paginación
  const indexUltimo = paginaActual * proyectosPorPagina;
  const indexPrimero = indexUltimo - proyectosPorPagina;
  const proyectosPagina = proyectosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(
    proyectosFiltrados.length / proyectosPorPagina
  );

  const handlePagina = (numero) => setPaginaActual(numero);

  const handleEstadoChange = async (projectId, nuevoEstado) => {

    const datosActualizados = {
      estado: nuevoEstado
    };

    try {
      const response = await fetch(
        `http://localhost:3001/proyectos/${projectId}`,
        {
          method: "PATCH", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosActualizados),
        }
      );

      if (!response.ok) {
        throw new Error(`Error al actualizar estado: ${response.status}`);
      }

      // 2. Obtener el proyecto actualizado (opcional, pero buena práctica)
      const proyectoActualizado = await response.json();

      // 3. Actualizar el estado local (MUY IMPORTANTE)
      setProyectos((prevProyectos) =>
        prevProyectos.map((p) => (p.id === projectId ? proyectoActualizado : p))
      );
    } catch (error) {
      console.error("Error al guardar el estado:", error);
      // Aquí podrías mostrar una notificación de error al usuario
    }
  };
  return (
    <div className="container mt-4">
      <div className="d-flex mb-3 justify-content-between">
        <h4 className="mb-3">Proyectos Registrados</h4>
        <Button 
        variant="secondary" 
        onClick={() =>navigate(`/proyectslist/proyect/create`)}>Nuevo Proyecto</Button>
      </div>

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
              <tr>
                <th>ID</th>
                <th>Nombre Proyecto</th>
                <th>Fecha Inicio</th>
                <th>Estado de Proyecto</th>
                <th>ID Equipo</th>
                <th>Cliente</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {proyectosPagina && proyectosPagina.length > 0 ? (
                // --- Caso 1: Hay proyectos para mostrar ---
                proyectosPagina.map((p) => (
                  <tr key={p.id}>
                    <td>{p.idProyecto}</td>
                    <td>{p.nombreProyecto}</td>
                    <td>{p.fechaInicioProyecto}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        defaultValue={p.estadoProyecto}
                        onChange={(e) =>
                          handleEstadoChange(p.id, e.target.value)
                        }
                      >
                        <option>En Planificación</option>
                        <option>En curso</option>
                        <option>Terminado</option>
                      </Form.Select>
                    </td>
                    <td>{p.idEquipo}</td>
                    <td>{p.idCliente}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="warning" size="sm">
                          Opciones
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() =>
                              navigate(`/proyectslist/proyect/${p.id}`)
                            }
                          >
                            Ver detalles
                          </Dropdown.Item>
                          <Dropdown.Item>Editar</Dropdown.Item>
                          <Dropdown.Item>Eliminar</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                // --- Caso 2: El arreglo está vacío (o es null/undefined) ---
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    {/* El mensaje centralizado */}
                    <h3>⚠️ No existen proyectos cargados aún.</h3>
                    <p>Comienza creando un nuevo proyecto para verlo aquí.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* PAGINACIÓN */}
          <Pagination>
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
        </>
      )}
    </div>
  );
};

export default ListProyects;
