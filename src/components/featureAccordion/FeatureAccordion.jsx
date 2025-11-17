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
import IncidentModal from "../incidentModal/IncidentModal";

const getBadgeBg = (tipo) => {
  switch (tipo) {
    case "Humano":
      return "primary";
    case "Tecnológico":
      return "purple";
    case "Material":
      return "warning";
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

const FeatureAccordion = ({ feature, eventKey, onTaskAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModalTwo, setShowModalTwo] = useState(false);
  const [showModalThree, setShowModalThree] = useState(false);
  const [showModalTask, setShowModalTask] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { nombre, descripcion, tareas, incidencias } = feature;

  const handleAddTask = () => {
    setSelectedFeature(feature);
    setSelectedTask(null); 
    setShowModalTwo(true);
  };

  const handleCloseTaskModal = () => {
    setShowModalTwo(false);
    setSelectedTask(null);
    setSelectedFeature(null);
  };

  const handleSubmitTask = async (taskData) => {
    setIsLoading(true);
    try {
      const taskPayload = {
        idFunction: feature.id, 
        taskName: taskData.nombre,
        taskDescription: taskData.descripcion,
        priority: taskData.prioridad || 0,
        dateEnd: taskData.fechaFin || "2025-11-30" 
      };

      console.log("Enviando tarea:", taskPayload);

      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskPayload)
      });

      if (!response.ok) {
        throw new Error('Error al crear la tarea');
      }

      const result = await response.json();
      console.log("Tarea creada exitosamente:", result);

      handleCloseTaskModal();

      if (onTaskAdded) {
        onTaskAdded();
      }

      // Mostrar mensaje de éxito
      alert('Tarea creada exitosamente');

    } catch (error) {
      console.error('Error al crear tarea:', error);
      alert('Error al crear la tarea: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowModalTwo(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      try {
        // Aquí iría la llamada DELETE a la API
        const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la tarea');
        }

        // Notificar al componente padre
        if (onTaskAdded) {
          onTaskAdded();
        }

        alert('Tarea eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        alert('Error al eliminar la tarea: ' + error.message);
      }
    }
  };

  return (
    <Accordion.Item eventKey={eventKey} className="feature-accordion-item">
      <Accordion.Header>
        <Row className="w-100">
          <Col>
            <div className="feature-header-content">
              <h5 className="mb-0">{nombre}</h5>
            </div>
            <Row className="pt-2">
              <Col>
                <div>
                  <small className="text-muted">{descripcion}</small>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Accordion.Header>

      <Accordion.Body>
        {/* --- Sección de Tareas --- */}
        <div className="section-header mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              Tareas 
              <Badge bg="light" text="dark" className="ms-2">
                {tareas.length}
              </Badge>
            </h5>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleAddTask}
              disabled={isLoading}
            >
              <BsPlusLg className="me-1" /> 
              {isLoading ? "Cargando..." : "Agregar Tarea"}
            </Button>
          </div>
        </div>

        <ListGroup variant="flush" className="mb-4">
          {tareas.length > 0 ? (
            tareas.map((task) => (
              <ListGroup.Item key={task.id} className="task-item py-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <strong className="me-2">{task.nombre}</strong>
                      <Badge bg={getStatusBadge(task.estado)}>
                        {task.estado}
                      </Badge>
                      {task.prioridad !== undefined && (
                        <Badge bg="outline-secondary" className="ms-1">
                          Prio: {task.prioridad}
                        </Badge>
                      )}
                    </div>
                    <small className="text-muted d-block mb-2">
                      {task.descripcion}
                    </small>
                    {(task.fechaInicio || task.fechaFin) && (
                      <div className="task-dates">
                        <small className="text-muted">
                          {task.fechaInicio && task.fechaInicio !== "0001-01-01" && (
                            <>Inicio: {new Date(task.fechaInicio).toLocaleDateString()}</>
                          )}
                          {task.fechaFin && (
                            <> | Fin: {new Date(task.fechaFin).toLocaleDateString()}</>
                          )}
                        </small>
                      </div>
                    )}
                  </div>
                  <div className="d-flex ms-3">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-1"
                      onClick={() => handleEditTask(task)}
                      disabled={isLoading}
                    >
                      <BsPencil />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={isLoading}
                    >
                      <BsTrash />
                    </Button>
                  </div>
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>
              <p className="text-muted text-center mb-0">No hay tareas creadas.</p>
            </ListGroup.Item>
          )}
        </ListGroup>


      </Accordion.Body>

      {/* Modales */}
      <CreateTaskModal
        show={showModalTwo}
        onHide={handleCloseTaskModal}
        onSubmit={handleSubmitTask}
        idFunction={feature.id} // Pasamos el ID de la funcionalidad
        taskData={selectedTask}
        isLoading={isLoading}
      />

      <IncidentModal
        show={showModalThree}
        onHide={() => setShowModalThree(false)}
      />
    </Accordion.Item>
  );
};

export default FeatureAccordion;
