// import React from "react";
// import { Modal, Button } from "react-bootstrap";

// const statusColors = {
//   "En Planificación": "#FCEEC0",
//   "Completado": "#C8F7DF",
//   "En Curso": "#CBE3FF",
// };

// const statusTextColors = {
//   "En Planificación": "#B68B00",
//   "Completado": "#1E9E61",
//   "En Curso": "#1E5DB3",
// };

// const CustomerHistory = ({ show, handleClose, cliente }) => {
//   if (!cliente) return null;

//   return (
//     <Modal
//       show={show}
//       onHide={handleClose}
//       centered
//       size="lg"
//       contentClassName="rounded-4"
//     >
//       {/* HEADER */}
//       <div
//         style={{
//           background: "linear-gradient(90deg, #E8D9FF 0%, #E2CCFF 100%)",
//           borderRadius: "1rem 1rem 0 0",
//           padding: "1.5rem",
//         }}
//       >
//         <h4 className="m-0 fw-bold">{cliente.nombreCliente}</h4>
//         <small className="text-secondary">Historial de Proyectos</small>
//       </div>

//       {/* BODY */}
//       <Modal.Body style={{ backgroundColor: "#F7F7F7" }}>
//         {cliente.proyectos?.map((p) => (
//           <div
//             key={p.idProyecto}
//             className="p-3 mb-3 bg-white shadow-sm rounded-3"
//             style={{ borderLeft: "4px solid #A45BFF" }}
//           >
//             <div className="d-flex justify-content-between align-items-start">
//               <div>
//                 <h5 className="fw-semibold">{p.nombreProyecto}</h5>
//                 <small className="text-muted">ID: {p.idProyecto}</small>
//               </div>

//               {/* BADGE */}
//               <span
//                 style={{
//                   backgroundColor: statusColors[p.estadoProyecto],
//                   color: statusTextColors[p.estadoProyecto],
//                   padding: "4px 12px",
//                   borderRadius: "999px",
//                   fontSize: "0.8rem",
//                   fontWeight: "600",
//                 }}
//               >
//                 {p.estadoProyecto}
//               </span>
//             </div>
//           </div>
//         ))}

//         {cliente.proyectos?.length === 0 && (
//           <p className="text-center text-muted">No hay proyectos registrados.</p>
//         )}
//       </Modal.Body>

//       {/* FOOTER */}
//       <div className="text-center p-3">
//         <Button
//           onClick={handleClose}
//           style={{
//             backgroundColor: "#A020F0",
//             border: "none",
//             width: "50%",
//             borderRadius: "10px",
//           }}
//         >
//           Cerrar
//         </Button>
//       </div>
//     </Modal>
//   );
// };

// export default CustomerHistory;
import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

// Mapeo de estados en español
const stateMapping = {
  "In_Progress": "En Curso",
  "Completed": "Completado", 
  "Planning": "En Planificación",
  "In_Planification": "En Planificación"
};

const statusColors = {
  "En Planificación": "#FCEEC0",
  "Completado": "#C8F7DF",
  "En Curso": "#CBE3FF",
};

const statusTextColors = {
  "En Planificación": "#B68B00",
  "Completado": "#1E9E61",
  "En Curso": "#1E5DB3",
};

const CustomerHistory = ({ show, handleClose, clienteId }) => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && clienteId) {
      fetchClienteData();
    } else {
      setCliente(null);
      setError(null);
    }
  }, [show, clienteId]);

  const fetchClienteData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Buscando cliente ID:", clienteId);
      
      // PRIMERO: Buscar el cliente en clientsRegistered para obtener su nombre
      const clientResponse = await fetch(`http://localhost:3001/clientsRegistered/${clienteId}`);
      
      if (!clientResponse.ok) {
        throw new Error(`Cliente no encontrado (${clientResponse.status})`);
      }
      
      const clientData = await clientResponse.json();
      console.log("Cliente encontrado:", clientData);
      
      // SEGUNDO: Buscar en getByIdWithProjects usando el nombre del cliente
      const projectsResponse = await fetch(
        `http://localhost:3001/getByIdWithProjects?clientFound.fullNameClient=${encodeURIComponent(clientData.fullNameClient)}`
      );
      
      if (!projectsResponse.ok) {
        throw new Error("Error al cargar proyectos");
      }
      
      const projectsData = await projectsResponse.json();
      console.log("Datos de getByIdWithProjects:", projectsData);
      
      // Buscar el cliente específico en la respuesta
      const clienteConProyectos = projectsData.find(item => 
        item.clientFound && item.clientFound.fullNameClient === clientData.fullNameClient
      );
      
      if (clienteConProyectos) {
        setCliente(clienteConProyectos.clientFound);
      } else {
        // Si no encuentra en getByIdWithProjects, usar solo los datos básicos del cliente
        setCliente({
          ...clientData,
          projects: []
        });
      }
      
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Error al cargar los datos del cliente");
    } finally {
      setLoading(false);
    }
  };

  // Función para traducir el estado del proyecto
  const translateState = (state) => {
    return stateMapping[state] || state;
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString || dateString === "0001-01-01" || dateString === "0001-01-01T00:00:00") {
      return "No definida";
    }
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return "Fecha inválida";
    }
  };

  if (!show) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      contentClassName="rounded-4"
    >
      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(90deg, #E8D9FF 0%, #E2CCFF 100%)",
          borderRadius: "1rem 1rem 0 0",
          padding: "1.5rem",
        }}
      >
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 mb-0">Cargando información...</p>
          </div>
        ) : error ? (
          <div className="text-center text-danger">
            <p>Error: {error}</p>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={fetchClienteData}
              className="mt-2"
            >
              Reintentar
            </Button>
          </div>
        ) : cliente ? (
          <>
            <h4 className="m-0 fw-bold">{cliente.fullNameClient}</h4>
            <small className="text-secondary">Historial de Proyectos</small>
            <div className="mt-2">
              <small className="text-muted">
                <strong>DNI:</strong> {cliente.dniClient} | 
                <strong> Email:</strong> {cliente.mailClient} | 
                <strong> Teléfono:</strong> {cliente.phoneClient}
              </small>
            </div>
            {cliente.directionClient && (
              <div className="mt-1">
                <small className="text-muted">
                  <strong>Dirección:</strong> {cliente.directionClient}
                </small>
              </div>
            )}
          </>
        ) : (
          <p>No se encontró información del cliente</p>
        )}
      </div>

      {/* BODY */}
      <Modal.Body style={{ backgroundColor: "#F7F7F7" }}>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Cargando proyectos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-muted">{error}</p>
          </div>
        ) : cliente && cliente.projects ? (
          <>
            <div className="mb-3">
              <small className="text-muted">
                Total de proyectos: {cliente.projects.length}
              </small>
            </div>

            {cliente.projects.map((proyecto) => (
              <div
                key={proyecto.idProject}
                className="p-3 mb-3 bg-white shadow-sm rounded-3"
                style={{ borderLeft: "4px solid #A45BFF" }}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="flex-grow-1">
                    <h5 className="fw-semibold mb-1">{proyecto.nameProject}</h5>
                    <small className="text-muted">ID: {proyecto.idProject}</small>
                  </div>

                  {/* BADGE ESTADO */}
                  <span
                    style={{
                      backgroundColor: statusColors[translateState(proyecto.stateProject)],
                      color: statusTextColors[translateState(proyecto.stateProject)],
                      padding: "4px 12px",
                      borderRadius: "999px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      minWidth: "120px",
                      textAlign: "center"
                    }}
                  >
                    {translateState(proyecto.stateProject)}
                  </span>
                </div>

                {/* INFORMACIÓN ADICIONAL DEL PROYECTO */}
                <div className="row mt-3">
                  <div className="col-md-6">
                    <small className="text-muted d-block">
                      <strong>Tipo:</strong> {proyecto.typeProject}
                    </small>
                    <small className="text-muted d-block mt-1">
                      <strong>Prioridad:</strong> {proyecto.priorityProject}
                    </small>
                    <small className="text-muted d-block mt-1">
                      <strong>Equipo:</strong> {proyecto.teamNumber || "No asignado"}
                    </small>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted d-block">
                      <strong>Presupuesto:</strong> ${proyecto.budgetProject?.toLocaleString()}
                    </small>
                    <small className="text-muted d-block mt-1">
                      <strong>Inicio:</strong> {formatDate(proyecto.dateInitial || proyecto.dataInitial)}
                    </small>
                    <small className="text-muted d-block mt-1">
                      <strong>Fin:</strong> {formatDate(proyecto.dateEnd || proyecto.dataEnd)}
                    </small>
                  </div>
                </div>

                {proyecto.descriptionProject && (
                  <div className="mt-3">
                    <small className="text-muted">
                      <strong>Descripción:</strong> {proyecto.descriptionProject}
                    </small>
                  </div>
                )}

                {/* FUNCIONES DEL PROYECTO */}
                {proyecto.functions && proyecto.functions.length > 0 && (
                  <div className="mt-3">
                    <small className="fw-semibold">Funcionalidades:</small>
                    <ul className="ps-3 mt-1 mb-0">
                      {proyecto.functions.slice(0, 3).map((func, index) => (
                        <li key={index}>
                          <small className="text-muted">
                            <strong>{func.functionName}:</strong> {func.functionDescription}
                          </small>
                        </li>
                      ))}
                      {proyecto.functions.length > 3 && (
                        <li>
                          <small className="text-muted">
                            y {proyecto.functions.length - 3} más...
                          </small>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {cliente.projects.length === 0 && (
              <p className="text-center text-muted py-4">
                No hay proyectos registrados para este cliente.
              </p>
            )}
          </>
        ) : null}
      </Modal.Body>

      {/* FOOTER */}
      <div className="text-center p-3">
        <Button
          onClick={handleClose}
          disabled={loading}
          style={{
            backgroundColor: "#A020F0",
            border: "none",
            width: "50%",
            borderRadius: "10px",
          }}
        >
          {loading ? "Cargando..." : "Cerrar"}
        </Button>
      </div>
    </Modal>
  );
};

export default CustomerHistory;