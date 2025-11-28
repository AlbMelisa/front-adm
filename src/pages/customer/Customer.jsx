import React, { useState, useEffect } from "react";
import {
  Form,
  InputGroup,
  Table,
  Button,
  Badge,
  Card,
  Spinner,
  Pagination
} from "react-bootstrap";
import "./customer.css";
import CustomerHistory from "../../components/customerHistory/customerHistory";

const Customer = () => {
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número de items por página

  // Estados para el modal
  const [showHistory, setShowHistory] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [proyectosCliente, setProyectosCliente] = useState([]);
  const [loadingProyectos, setLoadingProyectos] = useState(false);

  // Obtener el token del localStorage o sessionStorage
  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Headers con autorización
  const getAuthHeaders = () => {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Cargar clientes desde la API
  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        setError("No se encontró token de autenticación");
        return;
      }

      const resp = await fetch("http://localhost:5111/api/Clients/getAll", {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!resp.ok) {
        if (resp.status === 401) {
          setError("Token expirado o inválido");
          return;
        }
        throw new Error(`Error ${resp.status}: ${resp.statusText}`);
      }
      
      const data = await resp.json();
      
      // Asumiendo que la API devuelve un array de clientes
      // Si viene con estructura { message, clientsRegistered }, ajustamos
      const clientesData = data.clientsRegistered || data;
      setClientes(clientesData);
      console.log("Clientes cargados:", clientesData);
    } catch (error) {
      console.error("Error cargando clientes:", error);
      setError(error.message || "Error al cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  // Cargar proyectos de un cliente específico
  const fetchProyectosCliente = async (idClient) => {
    setLoadingProyectos(true);
    try {
      const token = getToken();
      if (!token) {
        console.error("No se encontró token de autenticación");
        setProyectosCliente([]);
        return;
      }

      const resp = await fetch(`http://localhost:5111/api/Clients/getByIdWithProjects/${idClient}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!resp.ok) {
        if (resp.status === 401) {
          console.error("Token expirado o inválido");
          setProyectosCliente([]);
          return;
        }
        throw new Error(`Error ${resp.status}: ${resp.statusText}`);
      }
      
      const data = await resp.json();
      
      console.log("Proyectos del cliente:", data);
      
      if (data.clientFound && data.clientFound.projects) {
        setProyectosCliente(data.clientFound.projects);
      } else {
        setProyectosCliente([]);
      }
    } catch (error) {
      console.error("Error cargando proyectos del cliente:", error);
      setProyectosCliente([]);
    } finally {
      setLoadingProyectos(false);
    }
  };

  // Abrir modal con cliente seleccionado
  const abrirHistorial = async (cliente) => {
    setClienteSeleccionado(cliente);
    setShowHistory(true);
    
    // Cargar los proyectos del cliente seleccionado
    await fetchProyectosCliente(cliente.idClient);
  };

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError("No estás autenticado. Por favor, inicia sesión.");
      return;
    }
    fetchClientes();
  }, []);

  // Filtrar clientes basado en la búsqueda
  const filtered = search.trim() === "" 
    ? clientes  // Si no hay búsqueda, mostrar todos los clientes
    : clientes.filter(
        (c) =>
          c.fullNameClient?.toLowerCase().includes(search.toLowerCase()) ||
          c.dniClient?.toString().includes(search) ||
          c.idClient?.toString().includes(search)
      );

  // Resetear a página 1 cuando se realiza una búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Calcular datos para paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generar números de página
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Función para manejar cierre de sesión o redirección
  const handleAuthError = () => {
    // Limpiar token y redirigir al login
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    window.location.href = '/login'; // Ajusta la ruta según tu aplicación
  };

  // Componente de paginación
  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">
          Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filtered.length)} de {filtered.length} clientes
        </div>
        <Pagination className="mb-0">
          <Pagination.Prev 
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          />
          
          {pageNumbers.map(number => (
            <Pagination.Item
              key={number}
              active={number === currentPage}
              onClick={() => paginate(number)}
            >
              {number}
            </Pagination.Item>
          ))}
          
          <Pagination.Next 
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
          />
        </Pagination>
      </div>
    );
  };

  return (
    <div className="customer-container">

      {/* TÍTULO */}
      <h2 className="customer-title">Clientes</h2>

      {/* BUSCADOR */}
      <div className="customer-search-card shadow-sm">
        <Card.Body>
          <InputGroup>
            <InputGroup.Text className="search-icon">🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar cliente por nombre, DNI o ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Card.Body>
      </div>

      {/* ESTADO DE CARGA Y ERROR */}
      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando clientes...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-4 text-danger">
          <p>{error}</p>
          {error.includes("token") || error.includes("autenticado") ? (
            <Button variant="outline-danger" size="sm" onClick={handleAuthError}>
              Iniciar Sesión
            </Button>
          ) : (
            <Button variant="outline-primary" size="sm" onClick={fetchClientes}>
              Reintentar
            </Button>
          )}
        </div>
      )}

      {/* TABLA: muestra todos los clientes o los filtrados */}
      {!loading && !error && (
        <>
          <div className="customer-table-card shadow-sm mt-4">
            <Card.Body className="p-0">
              <Table hover responsive className="customer-table mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NOMBRE</th>
                    <th>EMAIL</th>
                    <th>TELÉFONO</th>
                    <th>DNI</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((cliente) => (
                      <tr key={cliente.idClient}>
                        <td>{cliente.idClient}</td>
                        <td className="customer-name">{cliente.fullNameClient}</td>
                        <td>{cliente.mailClient}</td>
                        <td>{cliente.phoneClient}</td>
                        <td>{cliente.dniClient}</td>
                        <td>
                          <Button
                            size="sm"
                            className="btn-historial"
                            onClick={() => abrirHistorial(cliente)}
                          >
                            Ver Historial
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-3 text-muted">
                        {clientes.length === 0 ? "No hay clientes registrados" : "No se encontraron coincidencias"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </div>

          {/* PAGINACIÓN */}
          <PaginationComponent />
        </>
      )}

      {/* MODAL DE HISTORIAL */}
      <CustomerHistory
        show={showHistory}
        handleClose={() => {
          setShowHistory(false);
          setProyectosCliente([]);
        }}
        cliente={clienteSeleccionado}
        proyectos={proyectosCliente}
        loading={loadingProyectos}
      />
    </div>
  );
};

export default Customer;