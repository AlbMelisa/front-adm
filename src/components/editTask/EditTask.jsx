import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";

const EditTask = ({ show, onHide, task, onSave }) => {
  const [taskState, setTaskState] = useState("");
  const [progressState, setProgressState] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");

  // Cargar rol desde storage
  useEffect(() => {
    const storedUserStr = localStorage.getItem("user");
    if (storedUserStr) {
      try {
        const userObj = JSON.parse(storedUserStr);
        if (userObj?.rolEmployee) {
          setUserRole(userObj.rolEmployee);
        }
      } catch (error) {
        console.error("Error al leer usuario:", error);
      }
    }
  }, []);

  // Cargar estados iniciales desde la tarea
  useEffect(() => {
    if (task) {
      setTaskState(task.taskState || "Development");
      setProgressState(task.progressState || "Progress");
    }
  }, [task]);

  // Obtener token
  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const getAuthHeaders = () => {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // PATCH completeTask/:id
  const updateTask = async (taskId) => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) throw new Error("No se encontró token de autenticación");

      const response = await fetch(
        `http://localhost:5111/api/Task/completeTask/${taskId}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        if (response.status === 401) throw new Error("Token inválido");
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Tarea completada:", data);

      onSave(taskId, data);
     // onHide();
    } catch (error) {
      console.error("Error actualizando tarea:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!task) return;
    updateTask(task.idTask);
  };

  // ===============================
  //   REGLAS FINALES DE HABILITACIÓN
  // ===============================

  const devCompleted = taskState === "Completed";
  const testerCompleted = progressState === "Completed";

  // Developer → solo modifica taskState mientras NO esté Completed
  const canDevEditTaskState =
    userRole === "Developer" && !devCompleted;

  // Tester → solo modifica progressState mientras NO esté Completed
  const canTesterEditProgress =
    userRole === "Tester" && !testerCompleted;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Tarea</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <h5>{task?.nombre || task?.taskName}</h5>
        <p className="text-muted">{task?.descripcion || task?.taskDescription}</p>

        {/* Select del Developer */}
        <Form.Group className="mb-4">
          <Form.Label>Estado de Tarea (Developer)</Form.Label>

          <Form.Select
            value={taskState}
            onChange={(e) => setTaskState(e.target.value)}
            disabled={!canDevEditTaskState}
          >
            <option value="Development">Desarrollo</option>
            <option value="Completed">Completada</option>
          </Form.Select>
        </Form.Group>

        {/* Select del Tester */}
        <Form.Group className="mb-4">
          <Form.Label>Estado de Progreso (Tester)</Form.Label>

          <Form.Select
            value={progressState}
            onChange={(e) => setProgressState(e.target.value)}
            disabled={!canTesterEditProgress}
          >
            <option value="Progress">En progreso</option>
            <option value="Completed">Completado</option>
          </Form.Select>
        </Form.Group>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
            <p>Actualizando...</p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>

        <Button variant="dark" onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditTask;

