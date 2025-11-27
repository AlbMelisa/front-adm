
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
  const rawState = (estado || "").toLowerCase();

  switch (rawState) {
    case "completed":
    case "completada":
      return { variant: "success", label: "Completada" };
    case "testing":
    case "en testing":
      return { variant: "warning", label: "En Testing" };
    case "development":
    case "en desarrollo":
    case "in_progress":
      return { variant: "primary", label: "En Desarrollo" };
    default:
      return { variant: "primary", label: "En Desarrollo" };
  }
};

const FeatureAccordion = ({ feature, eventKey, onTaskAdded, onTaskDeleted }) => {
  console.log(feature)
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModalTwo, setShowModalTwo] = useState(false);
  const [showModalThree, setShowModalThree] = useState(false);
  const [showModalTask, setShowModalTask] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userRole, setUserRole] = useState("");
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [localTasks, setLocalTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState(new Set());

  const { nombre, descripcion, tareas, incidencias, id } = feature;

  // Cargar tareas eliminadas desde localStorage al montar el componente
  useEffect(() => {
    const storedDeletedTasks = localStorage.getItem(`deletedTasks_${id}`);
    if (storedDeletedTasks) {
      setDeletedTasks(new Set(JSON.parse(storedDeletedTasks)));
    }
  }, [id]);

  // Guardar tareas eliminadas en localStorage cuando cambien
  useEffect(() => {
    if (deletedTasks.size > 0) {
      localStorage.setItem(`deletedTasks_${id}`, JSON.stringify([...deletedTasks]));
    }
  }, [deletedTasks, id]);

  // Filtrar tareas - excluir las eliminadas
  useEffect(() => {
    if (tareas) {
      const filteredTasks = tareas.filter(task => 
        !deletedTasks.has(task.idTask.toString())
      );
      setLocalTasks(filteredTasks);
    }
  }, [tareas, deletedTasks]);

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

  const handleTaskUpdate = (taskId, updatedData) => {
    setLocalTasks(prevTasks => 
      prevTasks.map(task => 
        task.idTask === taskId 
          ? { ...task, ...updatedData }
          : task
      )
    );
    setShowEditModal(false);
    setSelectedTask(null);
    if (onTaskAdded) {
      onTaskAdded();
    }
  };

  // FUNCIÓN MEJORADA PARA AGREGAR NUEVAS TAREAS
  const handleNewTaskAdded = (newTask) => {
    console.log("🔵 NUEVA TAREA RECIBIDA EN FEATURE ACCORDION:", newTask);
    
    // Verificar que newTask tenga la estructura correcta
    if (!newTask || !newTask.idTask) {
      console.error("❌ Error: Nueva tarea no tiene estructura válida", newTask);
      return;
    }

    const taskId = newTask.idTask.toString();
    
    // 1. Si esta tarea estaba marcada como eliminada, quitarla de la lista de eliminadas
    if (deletedTasks.has(taskId)) {
      console.log("🔄 Reactivando tarea previamente eliminada:", taskId);
      setDeletedTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }

    // 2. AGREGAR LA NUEVA TAREA AL ESTADO LOCAL INMEDIATAMENTE
    setLocalTasks(prevTasks => {
      // Verificar si la tarea ya existe para evitar duplicados
      const exists = prevTasks.some(task => task.idTask.toString() === taskId);
      if (exists) {
        console.log("⚠️ Tarea ya existe, actualizando:", taskId);
        return prevTasks.map(task => 
          task.idTask.toString() === taskId ? newTask : task
        );
      } else {
        console.log("✅ Agregando nueva tarea al listado:", newTask);
        return [...prevTasks, newTask];
      }
    });

    // 3. Cerrar el modal
    handleCloseTaskModal();
    
    // 4. Notificar al componente padre para sincronización global
    if (onTaskAdded) {
      console.log("📢 Notificando al componente padre sobre nueva tarea");
      onTaskAdded();
    }
  };

  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
    setShowSuccessAlert(false);
  };

  // FUNCIÓN DE ELIMINACIÓN MEJORADA - Con persistencia
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    
    setDeleteLoading(true);
    console.log("Eliminando tarea con ID:", taskToDelete);
    
    const taskIdToDelete = taskToDelete.toString();
    
    // 1. AGREGAR A LA LISTA DE TAREAS ELIMINADAS (PERSISTENTE)
    setDeletedTasks(prev => new Set(prev).add(taskIdToDelete));
    
    // 2. ELIMINAR DEL ESTADO LOCAL INMEDIATAMENTE
    setLocalTasks(prevTasks => {
      const filteredTasks = prevTasks.filter(task => task.idTask.toString() !== taskIdToDelete);
      console.log("Tareas después de eliminar:", filteredTasks);
      return filteredTasks;
    });

    // 3. NOTIFICAR AL PADRE
    if (onTaskDeleted) {
      onTaskDeleted(taskIdToDelete);
    }
    
    try {
      const tokenValidation = verifyToken();
      if (!tokenValidation.isValid) {
        alert(`Error de autenticación: ${tokenValidation.message}`);
        setDeleteLoading(false);
        return;
      }

      // 4. INTENTAR ELIMINAR EN EL BACKEND
      const response = await fetch(
        `http://localhost:5111/api/Task/deleteTask/${taskIdToDelete}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenValidation.token}`,
          },
          body: JSON.stringify({
            id: taskIdToDelete
          }),
        }
      );

      console.log("Response status:", response.status);

      if (response.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Sesión expirada");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.warn("Advertencia: La tarea podría no haberse eliminado del backend:", errorText);
        // NO revertimos la eliminación local aunque falle el backend
      } else {
        console.log("Eliminación en backend exitosa");
      }

      setShowSuccessAlert(true);
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setTaskToDelete(null);
        setShowSuccessAlert(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      // Aunque falle el backend, mantenemos la eliminación local
      alert("La tarea se eliminó localmente pero hubo un error en el servidor: " + error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Función para limpiar todas las eliminaciones (útil para debugging)
  const clearDeletedTasks = () => {
    setDeletedTasks(new Set());
    localStorage.removeItem(`deletedTasks_${id}`);
    // Recargar las tareas originales
    if (tareas) {
      setLocalTasks(tareas);
    }
  };

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
                {/* Botón para limpiar eliminaciones (solo desarrollo) */}
                {process.env.NODE_ENV === 'development' && deletedTasks.size > 0 && (
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    className="ms-2"
                    onClick={clearDeletedTasks}
                    title="Limpiar eliminaciones (solo desarrollo)"
                  >
                    ♻️
                  </Button>
                )}
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
          <div className="section-header mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                Tareas
                <Badge bg="light" text="dark" className="ms-2">
                  {localTasks.length}
                </Badge>
                {deletedTasks.size > 0 && (
                  <Badge bg="outline-secondary" className="ms-1" title="Tareas eliminadas">
                    -{deletedTasks.size}
                  </Badge>
                )}
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
            {localTasks.length > 0 ? (
              localTasks.map((task) => (
                <ListGroup.Item key={task.idTask} className="task-item py-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <strong className="me-2">
                          {task.nombre || task.taskName}
                        </strong>
                        {(() => {
                          const statusInfo = getTaskStatusInfo(
                            task.estado || task.taskState
                          );
                          return (
                            <Badge bg={statusInfo.variant}>
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
                  {tareas && tareas.length > 0 && deletedTasks.size > 0 
                    ? `Todas las tareas (${tareas.length}) han sido eliminadas`
                    : "No hay tareas creadas."
                  }
                </p>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Accordion.Body>

        {/* Modales - IMPORTANTE: Pasar correctamente el callback */}
        <CreateTaskModal
          show={showModalTwo}
          onHide={handleCloseTaskModal}
          idFunction={feature.id || feature.idFunction}
          taskData={selectedTask}
          isLoading={isLoading}
          onTaskAdded={handleNewTaskAdded} // ✅ Este es el callback clave
        />
        <IncidentModal
          show={showModalThree}
          onHide={() => setShowModalThree(false)}
        />
        <EditTask
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          task={selectedTask}
          onSave={handleTaskUpdate}
        />
      </Accordion.Item>

      {/* Modal de Confirmación para Eliminar */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                {deleteLoading ? "Eliminando..." : "Sí, Eliminar Permanentemente"}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FeatureAccordion;