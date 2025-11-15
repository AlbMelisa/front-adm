// FeatureAccordion.jsx
import React, { useState } from "react";
import {
  Accordion,
  Button,
  Badge,
  Card,
  ListGroup,
  Col,
  Row,
} from "react-bootstrap";
import { BsPencil, BsTrash, BsPlusLg } from "react-icons/bs";
import "../feature/features.css";
import CreateTaskModal from "../createTaskModal/CreateTaskModal";
// Componente para el color del badge de tipo de incidencia
const getBadgeBg = (tipo) => {
  switch (tipo) {
    case "Humano":
      return "primary";
    case "Tecnológico":
      return "purple"; // Usamos un color personalizado (definido en CSS)
    case "Material":
      return "warning";
    default:
      return "secondary";
  }
};

// Componente para el color del badge de estado de tarea
const getStatusBadge = (estado) => {
  switch (estado) {
    case "Completada":
      return "success";
    case "En Progreso":
      return "info";
    case "Pendiente":
      return "warning";
    default:
      return "secondary";
  }
};

const FeatureAccordion = ({ feature, eventKey }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModalTwo, setShowModalTwo] = useState(false);
  const [showModalThree, setShowModalThree] = useState(false);
  const [showModalTask, setShowModalTask] = useState(false);

  const [selectedFeature, setSelectedFeature] = useState(null);

  const { nombre, descripcion, tareas, incidencias } = feature;
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAddFeature = (newFeature) => {
    setFeatures([
      ...features,
      {
        ...newFeature,
        id: features.length + 1,
        tareas: [],
        incidencias: [],
      },
    ]);
    handleCloseModal();
  };
  return (
    <Accordion.Item eventKey={eventKey} className="feature-accordion-item">
      <Accordion.Header>
        <Row>
          <Col>
            <div className="feature-header-content">
              <h5 className="mb-0">{feature.nombre}</h5>
            </div>
          </Col>
          <Row className="pt-2">
            <Col>
              <div>
                <small className="text-muted">{feature.descripcion}</small>
              </div>
            </Col>
          </Row>
        </Row>
      </Accordion.Header>
      {/* AHORA VAN LOS BOTONES, FUERA DEL <Accordion.Header> */}
      <Accordion.Body>
        {/* --- Sección de Tareas --- */}
        <div className="section-header">
          <h5>Tareas</h5>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => {
              setSelectedFeature(feature); // 🚀 guardamos la funcionalidad
              setShowModalTwo(true); // abrimos modal
            }}
          >
            <BsPlusLg /> Agregar Tarea
          </Button>
        </div>
        <CreateTaskModal
          type="Tareas"
          show={showModalTwo}
          onHide={() => setShowModalTwo(false)}
          data={selectedTask}
        />
        <ListGroup variant="flush">
          {tareas.length > 0 ? (
            tareas.map((task) => (
              <ListGroup.Item key={task.id} className="task-item">
                <div className="task-item-header">
                  <div>
                    <strong>{task.nombre}</strong>{" "}
                    <Badge bg={getStatusBadge(task.estado)}>
                      {task.estado}
                    </Badge>
                  </div>
                  <div>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task); // 🚀 guardamos la funcionalidad
                        setShowModalTask(true); // abrimos modal
                      }}
                    >
                      <BsPencil />
                    </Button>
                    <Button variant="link" size="sm" className="text-danger">
                      <BsTrash />
                    </Button>
                  </div>
                </div>
                {/* <AddFeatureModal
                  type="Tarea"
                  show={showModalTask}
                  onHide={() => setShowModalTask(false)}
                  data={selectedTask}
                /> */}
                <small className="text-muted">{task.descripcion}</small>
              </ListGroup.Item>
            ))
          ) : (
            <p className="text-muted ms-3">No hay tareas creadas.</p>
          )}
        </ListGroup>
        {/* --- Sección de Incidencias --- */}
        <div className="section-header">
          <h5>Incidencias Asignadas</h5>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => {
              setSelectedFeature(feature); // 🚀 guardamos la funcionalidad
              setShowModalThree(true); // abrimos modal
            }}
          >
            <BsPlusLg /> Agregar Incidencia
          </Button>
        </div>
        {/* <AddFeatureModal
          type="Incidencia"
          show={showModalThree}
          onHide={() => setShowModalThree(false)}
          data={selectedFeature}
        /> */}
        <Row className="mb-4">
          {incidencias.length > 0 ? (
            incidencias.map((inc) => (
              <Col md={6} key={inc.id} className="mb-3">
                <Card className="item-card w-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <Card.Title>
                        {inc.nombre}{" "}
                        <Badge
                          className={
                            inc.tipo === "Tecnológico"
                              ? "badge-tecnologico"
                              : ""
                          }
                          bg={getBadgeBg(inc.tipo)}
                        >
                          {inc.tipo}
                        </Badge>
                      </Card.Title>
                      <div>
                        <Button variant="link" size="sm">
                          <BsPencil />
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger"
                        >
                          <BsTrash />
                        </Button>
                      </div>
                    </div>
                    <Card.Text>
                      {inc.necesidad || `Cantidad: ${inc.cantidad}`}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-muted ms-3">No hay incidencias asignadas.</p>
          )}
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default FeatureAccordion;
