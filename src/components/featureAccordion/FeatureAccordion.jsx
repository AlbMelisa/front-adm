import React, { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Badge,
  Card,
  ListGroup,
  Col,
  Row,
  Modal,
  Alert
} from "react-bootstrap";
import { BsPencil, BsTrash, BsPlusLg } from "react-icons/bs";
import "../feature/features.css";
import CreateTaskModal from "../createTaskModal/CreateTaskModal";
import IncidentModal from "../incidentModal/IncidentModal";
import EditTask from "../editTask/EditTask";

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

// Función corregida y mejorada
const getTaskStatusInfo = (estado) => {
  // Convertimos a minúsculas para evitar errores por mayúsculas/minúsculas
  const rawState = (estado || "").toLowerCase();

  switch (rawState) {
    case "completed":
    case "completada":
      return { variant: "success", label: "Completada" }; // Verde

    case "testing":
    case "en testing":
      return { variant: "warning", label: "En Testing" }; // Amarillo

    case "development":
    case "en desarrollo":
    case "in_progress":
      return { variant: "primary", label: "En Desarrollo" }; // Azul

    default:
      return { variant: "primary", label: "En Desarrollo" }; // Azul
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [userRole, setUserRole] = useState("");
  
  // Estados para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Estado para el alert de éxito DENTRO del modal
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // ESTADO LOCAL PARA LAS TAREAS
  const [localTasks, setLocalTasks] = useState([]);

  const { nombre, descripcion, tareas, incidencias, id } = feature;

  // Inicializar las tareas locales cuando cambia la feature
  useEffect(() => {
    if (tareas) {
      setLocalTasks(tareas);
    }
  }, [tareas]);

  // Función para verificar token
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

//   const handleTaskUpdate = (taskId, updatedData) => {
//   setLocalTasks((prevTasks) =>
//     prevTasks.map((task) =>
//       task.idTask === taskId ? { ...task, ...updatedData } : task
//     )
//   );

//   setShowEditModal(false);
//   setSelectedTask(null);
// };

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
    setShowEditModal(true);
  };

  // FUNCIÓN PARA ACTUALIZAR UNA TAREA LOCALMENTE
  const handleTaskUpdate = (taskId, updatedData) => {
    setLocalTasks(prevTasks => 
      prevTasks.map(task => 
        task.idTask === taskId 
          ? { ...task, ...updatedData }
          : task
      )
    );
    
    // Cerrar el modal de edición
    setShowEditModal(false);
    setSelectedTask(null);
    
    // Notificar al componente padre si es necesario
    if (onTaskAdded) {
      onTaskAdded();
    }
  };

  // FUNCIÓN PARA AGREGAR NUEVA TAREA LOCALMENTE
  const handleNewTaskAdded = (newTask) => {
    setLocalTasks(prevTasks => [...prevTasks, newTask]);
    handleCloseTaskModal();
    
    // Notificar al componente padre
    if (onTaskAdded) {
      onTaskAdded();
    }
  };

  // Función para abrir el modal de confirmación
  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
    setShowSuccessAlert(false); // Resetear alert al abrir
  };

  // Función para confirmar la eliminación - CORREGIDA
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    
    setDeleteLoading(true);
    console.log("Eliminando tarea con ID:", taskToDelete);
    
    try {
      const tokenValidation = verifyToken();
      if (!tokenValidation.isValid) {
        alert(`Error de autenticación: ${tokenValidation.message}`);
        setDeleteLoading(false);
        return;
      }

      // RUTA Y MÉTODO CORREGIDOS - PATCH a deleteTask/:id CON BODY
      const response = await fetch(
        `http://localhost:5111/api/Task/deleteTask/${taskToDelete}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenValidation.token}`,
          },
          body: JSON.stringify({
            id: taskToDelete
          }),
        }
      );

      console.log("Response status:", response.status);

      if (response.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      // Si la respuesta es exitosa pero no tiene contenido
      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      }

      console.log("Eliminación exitosa, resultado:", result);

      // ACTUALIZAR ESTADO LOCAL - ELIMINAR LA TAREA
      setLocalTasks(prevTasks => 
        prevTasks.filter(task => task.idTask !== taskToDelete)
      );

      // MOSTRAR ALERT DE ÉXITO DENTRO DEL MODAL
      setShowSuccessAlert(true);
      
      // Esperar 2 segundos para que el usuario vea el alert y luego cerrar todo
      setTimeout(() => {
        // Cerrar modal y notificar al componente padre
        setShowDeleteModal(false);
        setTaskToDelete(null);
        setShowSuccessAlert(false);
        
        if (onTaskAdded) {
          onTaskAdded();
        }
      }, 2000);
      
    } catch (error) {
      console.error("Error completo al eliminar tarea:", error);
      alert("Error al eliminar la tarea: " + error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
    setDeleteLoading(false);
    setShowSuccessAlert(false);
  };

  return (
    <>
      <Accordion.Item eventKey={eventKey} className="feature-accordion-item">
        <Accordion.Header>
          <Row className="w-100">
            <Col>
              <div className="feature-header-content">
                <h5 className="mb-0">{nombre}</h5>
                <Badge bg="secondary" className="ms-2">
                  ID: {feature.id}
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
                  {localTasks.length} {/* Usar localTasks en lugar de tareas */}
                </Badge>
              </h5>
              {["Manager"].includes(userRole) && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleAddTask}
                  disabled={isLoading}
                >
                  <BsPlusLg className="me-1" />
                  {isLoading ? "Cargando..." : "Agregar Tarea"}
                </Button>
              )}
            </div>
          </div>

          <ListGroup variant="flush" className="mb-4">
            {localTasks.length > 0 ? ( // Usar localTasks en lugar de tareas
              localTasks.map((task) => ( // Usar localTasks en lugar de tareas
                <ListGroup.Item key={task.idTask} className="task-item py-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <strong className="me-2">
                          {task.nombre || task.taskName}
                        </strong>
                        {(() => {
                          // 1. Usamos la función NUEVA para obtener color y texto
                          const statusInfo = getTaskStatusInfo(
                            task.estado || task.taskState
                          );

                          return (
                            <Badge bg={statusInfo.variant}>
                              {/* 2. Mostramos el texto traducido (label), no el crudo */}
                              {statusInfo.label}
                            </Badge>
                          );
                        })()}
                        {(task.prioridad !== undefined ||
                          task.priority !== undefined) && (
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
                            {task.fechaInicio &&
                              task.fechaInicio !== "0001-01-01" && (
                                <>
                                  Inicio:{" "}
                                  {new Date(
                                    task.fechaInicio
                                  ).toLocaleDateString()}
                                </>
                              )}
                            {(task.fechaFin || task.dateEnd) && (
                              <>
                                {" "}
                                | Fin:{" "}
                                {new Date(
                                  task.fechaFin || task.dateEnd
                                ).toLocaleDateString()}
                              </>
                            )}
                          </small>
                        </div>
                      )}
                      {task.resourceList && task.resourceList.length > 0 && (
                        <div className="task-resources mt-1">
                          <small className="text-muted">
                            Recursos: {task.resourceList.join(", ")}
                          </small>
                        </div>
                      )}
                    </div>
                    {["Developer","Tester"].includes(userRole) && (
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
                      </div>
                    )}
                    {["Manager"].includes(userRole) && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTask(task.idTask)}
                        disabled={isLoading}
                      >
                        <BsTrash />
                      </Button>
                    )}
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>
                <p className="text-muted text-center mb-0">
                  No hay tareas creadas.
                </p>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Accordion.Body>

        {/* Modales */}
        <CreateTaskModal
          show={showModalTwo}
          onHide={handleCloseTaskModal}
          idFunction={feature.id || feature.idFunction}
          taskData={selectedTask}
          isLoading={isLoading}
          onTaskAdded={handleNewTaskAdded} // Pasar callback para nueva tarea
        />
        <IncidentModal
          show={showModalThree}
          onHide={() => setShowModalThree(false)}
        />
        <EditTask
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          task={selectedTask}
          onSave={handleTaskUpdate} // Pasar callback para actualizar tarea
        />
      </Accordion.Item>

      {/* Modal de Confirmación para Eliminar */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* ALERT DE ÉXITO DENTRO DEL MODAL */}
          {showSuccessAlert ? (
            <Alert variant="success" className="mb-0">
              <Alert.Heading className="h6 mb-1 d-flex align-items-center">
                <span style={{ fontSize: '18px', marginRight: '8px' }}>✅</span>
                ¡Éxito!
              </Alert.Heading>
              <p className="mb-0">Tarea eliminada exitosamente</p>
            </Alert>
          ) : (
            <>
              <p>¿Estás seguro de que deseas eliminar esta tarea?</p>
              <p className="text-muted small">
                Esta acción no se puede deshacer.
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!showSuccessAlert && (
            <>
              <Button 
                variant="light" 
                onClick={handleCancelDelete}
                disabled={deleteLoading}
              >
                Cancelar
              </Button>
              <Button 
                variant="danger" 
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Eliminando..." : "Sí, Eliminar"}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FeatureAccordion;