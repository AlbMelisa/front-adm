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
import React from "react";
import { Modal, Card, Button, Spinner, Col, Row } from "react-bootstrap";

const CustomerHistory = ({ 
  show, 
  handleClose, 
  cliente, 
  proyectos, 
  loading 
}) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Historial de Proyectos - {cliente?.fullNameClient}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
            <p className="mt-2">Cargando proyectos...</p>
          </div>
        ) : proyectos.length > 0 ? (
          <div>
            <h6>Proyectos del cliente:</h6>
            {proyectos.map((proyecto) => (
              <Card key={proyecto.idProject} className="mb-3 w-100">
                <Card.Body>
                  <h6>{proyecto.nameProject}</h6>
                  <p><strong>Descripción:</strong> {proyecto.descriptionProject}</p>
                  <Row>
                    <Col>
                      <p><strong>Tipo:</strong> {proyecto.typeProject}</p>
                    </Col>
                    <Col>
                      <p><strong>Estado:</strong> {proyecto.stateProject}</p>
                    </Col>
                  </Row>
                  <p><strong>Presupuesto:</strong> ${proyecto.budgetProject}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted">No se encontraron proyectos para este cliente.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomerHistory;