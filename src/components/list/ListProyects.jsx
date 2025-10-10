import React, { useState, useEffect } from "react";
import { Table, Pagination, Dropdown, Form, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
// import axios from "axios"; // ← si preferís usar axios

const ListProyects = () => {
  // Estado para los proyectos
  const navigate = useNavigate()
  const [proyectos, setProyectos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargando, setCargando] = useState(false);

  const proyectosPorPagina = 5;

  // 🔹 Datos de ejemplo (modo local)
  const proyectosMock = [
    { id: 1, nombre: "Sistema de Gestión Interna", fecha: "15-01-2023", estado: "En Planificación", equipo: 1, cliente: "20345678901" },
    { id: 2, nombre: "Red de Comunicaciones Externas", fecha: "01-03-2023", estado: "En Planificación", equipo: 2, cliente: "20234567891" },
    { id: 3, nombre: "Migración a la Nube", fecha: "10-04-2023", estado: "En Planificación", equipo: 3, cliente: "20398765432" },
    { id: 4, nombre: "Sistema de Soporte Técnico", fecha: "20-08-2023", estado: "Terminado", equipo: 4, cliente: "20312345678" },
    { id: 5, nombre: "Desarrollo de Aplicación Móvil", fecha: "30-07-2023", estado: "En Planificación", equipo: 5, cliente: "20456789012" },
    { id: 6, nombre: "Gestor de Autos Volkswagen", fecha: "27-11-2024", estado: "En curso", equipo: 6, cliente: "20298765432" },
    { id: 7, nombre: "Gestor de Ropa", fecha: "28-11-2024", estado: "Terminado", equipo: 7, cliente: "20234567891" },
  ];

  // 🔹 useEffect para cargar los datos
  useEffect(() => {
    setCargando(true);

    // --- 🔸 OPCIÓN 1: Datos locales ---
    setTimeout(() => {
      setProyectos(proyectosMock);
      setCargando(false);
    }, 800);

    // --- 🔸 OPCIÓN 2: Cargar desde API (descomentar cuando tengas endpoint) ---
    /*
    const fetchData = async () => {
      try {
        setCargando(true);
        const response = await fetch("https://tuservidor.com/api/proyectos");
        // const response = await axios.get("https://tuservidor.com/api/proyectos");
        const data = await response.json();
        setProyectos(data);
      } catch (error) {
        console.error("Error al obtener los proyectos:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchData();
    */
  }, []);

  // 🔹 Filtrar proyectos por búsqueda
  const proyectosFiltrados = proyectos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.id.toString().includes(busqueda)
  );

  // 🔹 Paginación
  const indexUltimo = paginaActual * proyectosPorPagina;
  const indexPrimero = indexUltimo - proyectosPorPagina;
  const proyectosPagina = proyectosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(proyectosFiltrados.length / proyectosPorPagina);

  const handlePagina = (numero) => setPaginaActual(numero);

  return (
    <div className="container mt-4">
      <div className="d-flex mb-3 justify-content-between">
        <h4 className="mb-3">Proyectos Registrados</h4>
        <Button variant="secondary">Nuevo Proyecto</Button>
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
              {proyectosPagina.map((p) => (
                <tr key={p.id} onClick={() => navigate(`/proyectslist/proyect/${p.id}`)
                        }>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.fecha}</td>
                  <td>
                    <Form.Select size="sm" defaultValue={p.estado}>
                      <option>En Planificación</option>
                      <option>En curso</option>
                      <option>Terminado</option>
                    </Form.Select>
                  </td>
                  <td>{p.equipo}</td>
                  <td>{p.cliente}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="warning" size="sm">
                        Opciones
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>Ver detalles</Dropdown.Item>
                        <Dropdown.Item>Editar</Dropdown.Item>
                        <Dropdown.Item>Eliminar</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
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

