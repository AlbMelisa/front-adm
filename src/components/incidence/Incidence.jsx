import React, { useEffect, useState } from "react";
import { Accordion, Button, Badge, Card, Row, Col } from "react-bootstrap";
import { BsPlusLg } from "react-icons/bs";
import IncidentModal from "../incidentModal/IncidentModal";
import "../incidentModal/incidentModal.css";
import { useId } from "react";

const getBadgeBg = (tipo) => {
  switch (tipo) {
    case "Humano":
      return "primary";
    case "Tecnológico":
      return "purple";
    case "Material":
      return "warning";
    case "Recursos":
      return "info";
    default:
      return "secondary";
  }
};

const getStatusBadge = (estado) => {
  switch (estado) {
    case "Completada":
      return "success";
    case "En Progreso":
      return "info";
    case "Pendiente":
      return "warning";
    case "Cancelada":
      return "danger";
    default:
      return "secondary";
  }
};

// Array de tipos de incidencia
const incidenceTypes = ["Humano", "Tecnológico", "Material", "Recursos"];

const Incidence = ({ incidences, onIncidenceAdded, projectId }) => {
  const rowId = useId();

  const [showModal, setShowModal] = useState(false);
  const [selectedIncidence, setSelectedIncidence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedUserStr = localStorage.getItem("user");
    if (storedUserStr) {
      try {
        const userObj = JSON.parse(storedUserStr);
        if (userObj && userObj.rolEmployee) {
          setUserRole(userObj.rolEmployee);
        }
      } catch (error) {
        console.error("Error al leer usuario:", error);
      }
    }
  }, []);
  const verifyToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return { isValid: false, message: "No hay token de autenticación" };
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("token");
        return { isValid: false, message: "Token expirado" };
      }

      return { isValid: true, token };
    } catch (parseError) {
      localStorage.removeItem("token");
      return { isValid: false, message: "Token inválido" };
    }
  };

  // Función para manejar la agregar incidencia
  const handleAddIncidence = () => {
    setSelectedIncidence(null);
    setShowModal(true);
  };

  // ⭐ FUNCIÓN CORREGIDA PARA EL POST CON EL FORMATO EXACTO
  const handleSubmitIncidence = async (incidenceData) => {
    setIsLoading(true);
    try {
      // Verificar token antes de enviar
      const tokenValidation = verifyToken();
      if (!tokenValidation.isValid) {
        throw new Error(tokenValidation.message);
      }

      // ⭐ PAYLOAD EXACTO CON EL FORMATO ESPECIFICADO
      const incidencePayload = {
        idProyect: projectId, // Usar el projectId que viene como prop
        typeIncidence: incidenceData.tipo,
        descriptionIncidence: incidenceData.descripcion,
      };


      // ⭐ POST A LA RUTA CORRECTA CON AUTENTICACIÓN
      const response = await fetch("http://localhost:5111/api/Incidence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenValidation.token}`,
        },
        body: JSON.stringify(incidencePayload),
      });

      // Manejar error 401
      if (response.status === 401) {
        localStorage.removeItem("token");
        throw new Error(
          "Sesión expirada. Por favor, inicia sesión nuevamente."
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error ${response.status}: ${errorText || response.statusText}`
        );
      }

      const result = await response.json();

      setShowModal(false);
      setSelectedIncidence(null);

      if (onIncidenceAdded) {
        onIncidenceAdded();
      }

      alert("Incidencia creada exitosamente");
    } catch (error) {
      console.error("Error al crear incidencia:", error);

      if (error.message.includes("sesión") || error.message.includes("token")) {
        alert(`Error de autenticación: ${error.message}`);
      } else {
        alert("Error al crear la incidencia: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Accordion className="pt-3 m-2" defaultActiveKey={["0"]}>
      <Accordion.Item eventKey="0">
        <Accordion.Header className="incidencias-header">
          Incidencias
        </Accordion.Header>
        <Accordion.Body>
          <div className="section-header mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                Incidencias Asignadas
                <Badge bg="light" text="dark" className="ms-2">
                  {incidences?.length || 0}
                </Badge>
              </h5>
              {['ProjectManager', 'Developer', 'Manager'].includes(userRole) && (
                <Button
                  className="btn-agregar-incidencia"
                  variant="outline-primary"
                  size="sm"
                  onClick={handleAddIncidence}
                  disabled={isLoading}
                >
                  <BsPlusLg className="me-1" /> Agregar Incidencia
                </Button>

              )}
            </div>
          </div>

          <Row className="mb-4">
            {incidences && incidences.length > 0 ? (
              incidences.map((inc, index) => (
                <Col md={6} 
                     key={`${rowId}-incidence-${inc.id || inc.idIncidence || index}`} 
                     className="mb-3">
                  <Card className="item-card w-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <Card.Title className="h6">
                            {inc.typeIncidence ||
                              inc.tipo ||
                              "Tipo no especificado"}{" "}
                            <Badge
                              className={
                                inc.typeIncidence === "Tecnológico" ||
                                inc.tipo === "Tecnológico"
                                  ? "badge-tecnologico"
                                  : ""
                              }
                              bg={getBadgeBg(inc.typeIncidence || inc.tipo)}
                            >
                              {inc.typeIncidence || inc.tipo}
                            </Badge>
                            {inc.incidenceState || inc.estado ? (
                              <Badge
                                bg={getStatusBadge(
                                  inc.incidenceState || inc.estado
                                )}
                                className="ms-1"
                              >
                                {inc.incidenceState || inc.estado}
                              </Badge>
                            ) : null}
                          </Card.Title>
                          <Card.Text className="mb-0">
                            {inc.descriptionIncidence ||
                              inc.descripcion ||
                              "Sin descripción"}
                          </Card.Text>
                          {inc.reportDate && (
                            <small className="text-muted d-block mt-1">
                              Fecha:{" "}
                              {new Date(inc.reportDate).toLocaleDateString()}
                            </small>
                          )}
                          <small className="text-muted d-block mt-1">
                            ID Proyecto: {inc.idProyect || projectId}
                          </small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <p className="text-muted text-center">
                  No hay incidencias asignadas.
                </p>
              </Col>
            )}
          </Row>

          <IncidentModal
            show={showModal}
            onHide={() => {
              setShowModal(false);
              setSelectedIncidence(null);
            }}
            onSubmit={handleSubmitIncidence}
            incidenceData={selectedIncidence}
            isLoading={isLoading}
            projectId={projectId}
            incidenceTypes={incidenceTypes} // Pasamos el array de tipos al modal
          />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default Incidence;
