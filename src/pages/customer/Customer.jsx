// import React, { useState } from "react";
// import {
//   Form,
//   InputGroup,
//   Table,
//   Button,
//   Badge,
//   Card,
// } from "react-bootstrap";
// import CustomerHistory from "../../components/customerHistory/customerHistory.jsx";
// import "./customer.css";

// const initialCustomers = [
//   { id: 501, nombre: "Tech Solutions Inc.", email: "contact@techsolutions.com", telefono: "+1 234-567-8900", proyectos: 3 },
//   { id: 502, nombre: "Digital Innovators", email: "info@digitalinnovators.com", telefono: "+1 234-567-8901", proyectos: 2 },
//   { id: 503, nombre: "Global Fitness Co.", email: "hello@globalfitness.com", telefono: "+1 234-567-8902", proyectos: 1 },
//   { id: 504, nombre: "Health Systems Ltd.", email: "contact@healthsystems.com", telefono: "+1 234-567-8903", proyectos: 0 },
// ];

// const Customer = () => {
//   const [search, setSearch] = useState("");

//   // Estados para el modal
//   const [showHistory, setShowHistory] = useState(false);
//   const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

//   const filtered = initialCustomers.filter(
//     (c) =>
//       c.nombre.toLowerCase().includes(search.toLowerCase()) ||
//       c.id.toString().includes(search)
//   );

//   // Abrir modal con cliente seleccionado
//   const abrirHistorial = (cliente) => {
//     setClienteSeleccionado(cliente);
//     setShowHistory(true);
//   };

//   return (
//     <div className="customer-container">

//       {/* TÍTULO */}
//       <h2 className="customer-title">Clientes</h2>

//       {/* BUSCADOR */}
//       <div className="customer-search-card shadow-sm">
//         <Card.Body>
//           <InputGroup>
//             <InputGroup.Text className="search-icon">🔍</InputGroup.Text>
//             <Form.Control
//               type="text"
//               placeholder="Buscar cliente por nombre o ID"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </InputGroup>
//         </Card.Body>
//       </div>

//       {/* TABLA: solo aparece si hay búsqueda */}
//       {search.trim() !== "" && (
//         <div className="customer-table-card shadow-sm mt-4">
//           <Card.Body className="p-0">
//             <Table hover responsive className="customer-table mb-0">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>NOMBRE</th>
//                   <th>EMAIL</th>
//                   <th>TELÉFONO</th>
//                   <th>PROYECTOS</th>
//                   <th>ACCIONES</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filtered.length > 0 ? (
//                   filtered.map((c) => (
//                     <tr key={c.id}>
//                       <td>{c.id}</td>
//                       <td className="customer-name">{c.nombre}</td>
//                       <td>{c.email}</td>
//                       <td>{c.telefono}</td>
//                       <td>
//                         <Badge pill bg="light" text="dark" className="customer-badge">
//                           {c.proyectos} proyectos
//                         </Badge>
//                       </td>
//                       <td>
//                         <Button
//                           size="sm"
//                           className="btn-historial"
//                           onClick={() => abrirHistorial(c)}
//                         >
//                           Ver Historial
//                         </Button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="text-center py-3 text-muted">
//                       No se encontraron coincidencias.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </Card.Body>
//         </div>
//       )}

//       {/* MODAL DE HISTORIAL */}
//       {clienteSeleccionado && (
//         <CustomerHistory
//           show={showHistory}
//           handleClose={() => setShowHistory(false)}
//           cliente={{
//             nombreCliente: clienteSeleccionado.nombre,
//             proyectos: [
//               {
//                 idProyecto: 1,
//                 nombreProyecto: "Migración a la Nube V3",
//                 estadoProyecto: "En Planificación",
//               },
//               {
//                 idProyecto: 5,
//                 nombreProyecto: "Actualización Sistema V2",
//                 estadoProyecto: "Completado",
//               },
//               {
//                 idProyecto: 8,
//                 nombreProyecto: "Integración API Externa",
//                 estadoProyecto: "Completado",
//               },
//             ],
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default Customer;

import React, { useState, useEffect } from "react";
import {
  Form,
  InputGroup,
  Table,
  Button,
  Badge,
  Card,
  Spinner
} from "react-bootstrap";
import CustomerHistory from "../../components/customerHistory/customerHistory.jsx";
import "./customer.css";

const Customer = () => {
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState([]);
  const [clientesConProyectos, setClientesConProyectos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingProyectos, setLoadingProyectos] = useState(false);

  // Estados para el modal
  const [showHistory, setShowHistory] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Cargar clientes desde el JSON
  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("http://localhost:3001/clientsRegistered");
      const data = await resp.json();
      setClientes(data);
      console.log("Clientes cargados:", data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
      setError("Error al cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  // Cargar proyectos usando SOLO getByIdWithProjects
  const fetchProyectosConGetById = async () => {
    setLoadingProyectos(true);
    try {
      const clientesConProyectosData = await Promise.all(
        clientes.map(async (cliente) => {
          try {
            // Usar SOLO getByIdWithProjects
            const resp = await fetch(`http://localhost:3001/getByIdWithProjects?clientFound.fullNameClient=${encodeURIComponent(cliente.fullNameClient)}`);
            const data = await resp.json();
            
            console.log(`Respuesta getByIdWithProjects para ${cliente.fullNameClient}:`, data);
            
            // Buscar el cliente en la respuesta
            const clienteConProyectos = data.find(item => 
              item.clientFound && item.clientFound.fullNameClient === cliente.fullNameClient
            );
            
            return {
              ...cliente,
              cantidadProyectos: clienteConProyectos ? clienteConProyectos.clientFound.projects.length : 0,
              tieneProyectos: !!clienteConProyectos
            };
          } catch (error) {
            console.error(`Error con getByIdWithProjects para ${cliente.fullNameClient}:`, error);
            return {
              ...cliente,
              cantidadProyectos: 0,
              tieneProyectos: false
            };
          }
        })
      );
      
      setClientesConProyectos(clientesConProyectosData);
    } catch (error) {
      console.error("Error cargando proyectos:", error);
    } finally {
      setLoadingProyectos(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    if (clientes.length > 0) {
      fetchProyectosConGetById();
    }
  }, [clientes]);

  // Filtrar clientes basado en la búsqueda
  const filtered = clientesConProyectos.filter(
    (c) =>
      c.fullNameClient.toLowerCase().includes(search.toLowerCase()) ||
      c.dniClient.toString().includes(search) ||
      c.id.toString().includes(search)
  );

  // Abrir modal con cliente seleccionado
  const abrirHistorial = (cliente) => {
    setClienteSeleccionado(cliente);
    setShowHistory(true);
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
          <Button variant="outline-primary" size="sm" onClick={fetchClientes}>
            Reintentar
          </Button>
        </div>
      )}

      {/* TABLA: solo aparece si hay búsqueda */}
      {search.trim() !== "" && !loading && !error && (
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
                  <th>PROYECTOS</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.id}</td>
                      <td className="customer-name">{cliente.fullNameClient}</td>
                      <td>{cliente.mailClient}</td>
                      <td>{cliente.phoneClient}</td>
                      <td>{cliente.dniClient}</td>
                      <td>
                        <Badge 
                          pill 
                          bg={cliente.cantidadProyectos > 0 ? "primary" : "light"} 
                          text={cliente.cantidadProyectos > 0 ? "white" : "dark"} 
                          className="customer-badge"
                        >
                          {loadingProyectos ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            `${cliente.cantidadProyectos} proyectos`
                          )}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          className="btn-historial"
                          onClick={() => abrirHistorial(cliente)}
                          disabled={cliente.cantidadProyectos === 0}
                        >
                          Ver Historial
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-3 text-muted">
                      No se encontraron coincidencias.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </div>
      )}

      {/* MENSAJE CUANDO NO HAY BÚSQUEDA */}
      {search.trim() === "" && !loading && !error && (
        <div className="text-center py-5 text-muted">
          <p>Ingresa un nombre, DNI o ID en el buscador para ver los clientes</p>
        </div>
      )}

      {/* MODAL DE HISTORIAL */}
      <CustomerHistory
        show={showHistory}
        handleClose={() => setShowHistory(false)}
        clienteId={clienteSeleccionado?.id}
      />
    </div>
  );
};

export default Customer;