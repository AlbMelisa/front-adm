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

  const { nombre, descripcion, tareas, incidencias, id } = feature;

  // Función para verificar token
  const verifyToken = () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return { isValid: false, message: "No hay token de autenticación" };
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
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

 
  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowModalTwo(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      try {
        // Verificar token antes de hacer la petición
        const tokenValidation = verifyToken();
        if (!tokenValidation.isValid) {
          throw new Error(tokenValidation.message);
        }

        const response = await fetch(`http://localhost:5111/api/Task/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${tokenValidation.token}`
          }
        });

        // Manejar error 401
        if (response.status === 401) {
          localStorage.removeItem("token");
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
        }

        // Notificar al componente padre
        if (onTaskAdded) {
          onTaskAdded();
        }

        alert('Tarea eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        
        if (error.message.includes("sesión") || error.message.includes("token")) {
          alert(`Error de autenticación: ${error.message}`);
        } else {
          alert('Error al eliminar la tarea: ' + error.message);
        }
      }
    }
  };

  // Función para actualizar tarea (si necesitas implementar PUT)
  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const tokenValidation = verifyToken();
      if (!tokenValidation.isValid) {
        throw new Error(tokenValidation.message);
      }

      const updatePayload = {
        idFunction: feature.id,
        taskName: taskData.nombre,
        taskDescription: taskData.descripcion,
        priority: taskData.prioridad || 0,
        dateEnd: taskData.fechaFin,
        resourceList: taskData.resourceList || []
      };

      const response = await fetch(`http://localhost:5111/api/Task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenValidation.token}`
        },
        body: JSON.stringify(updatePayload)
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Sesión expirada");
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      if (onTaskAdded) {
        onTaskAdded();
      }

      alert('Tarea actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      alert('Error al actualizar la tarea: ' + error.message);
    }
  };

  return (
    <Accordion.Item eventKey={eventKey} className="feature-accordion-item">
      <Accordion.Header>
        <Row className="w-100">
          <Col>
            <div className="feature-header-content">
              <h5 className="mb-0">{nombre}</h5>
              <Badge bg="secondary" className="ms-2">
                ID: {id}
              </Badge>
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
                {tareas ? tareas.length : 0}
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
          {tareas && tareas.length > 0 ? (
            tareas.map((task) => (
              <ListGroup.Item key={task.id} className="task-item py-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <strong className="me-2">{task.nombre || task.taskName}</strong>
                      <Badge bg={getStatusBadge(task.estado || task.taskState)}>
                        {task.estado || task.taskState || "Pendiente"}
                      </Badge>
                      {(task.prioridad !== undefined || task.priority !== undefined) && (
                        <Badge bg="outline-secondary" className="ms-1">
                          Prio: {task.prioridad || task.priority}
                        </Badge>
                      )}
                    </div>
                    <small className="text-muted d-block mb-2">
                      {task.descripcion || task.taskDescription}
                    </small>
                    {(task.fechaInicio || task.fechaFin || task.dateEnd) && (
                      <div className="task-dates">
                        <small className="text-muted">
                          {task.fechaInicio && task.fechaInicio !== "0001-01-01" && (
                            <>Inicio: {new Date(task.fechaInicio).toLocaleDateString()}</>
                          )}
                          {(task.fechaFin || task.dateEnd) && (
                            <> | Fin: {new Date(task.fechaFin || task.dateEnd).toLocaleDateString()}</>
                          )}
                        </small>
                      </div>
                    )}
                    {task.resourceList && task.resourceList.length > 0 && (
                      <div className="task-resources mt-1">
                        <small className="text-muted">
                          Recursos: {task.resourceList.join(', ')}
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
        idFunction={feature.id}
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