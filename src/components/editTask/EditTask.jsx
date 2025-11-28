import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner, Badge } from "react-bootstrap";

const EditTask = ({ show, onHide, task, onSave }) => {
  const [taskState, setTaskState] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // -------------------------
  //   Cargar rol desde storage
  // -------------------------
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

  // -------------------------------------------
  //   Cargar estado inicial desde la tarea (FIX)
  // -------------------------------------------
  useEffect(() => {
    if (task) {
      const initialState = task.taskState || "Development";
      setTaskState(initialState);
      setSelectedState(initialState);
      setIsSaved(false);    // ← FIX IMPORTANTE
    }
  }, [task]);

  // -------------------------------------------
  //   Obtener token
  // -------------------------------------------
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

  // -------------------------------------------
  //   PATCH a la API cuando se guarda
  // -------------------------------------------
  const updateTaskState = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) throw new Error("No se encontró token de autenticación");

      const response = await fetch(
        `http://localhost:5111/api/Task/completeTask/${task.idTask}`,
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
      console.log("Tarea actualizada:", data);

      setTaskState(selectedState);
      setIsSaved(true);

      if (onSave) onSave(task.idTask, data);

    } catch (error) {
      console.error("Error actualizando tarea:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------
  //   Guardar cambios
  // -------------------------------------------
  const handleSubmit = () => {
    if (!task) return;

    if (userRole === "Developer" && taskState === "Development" && selectedState !== "Testing") {
      setError("Como Developer, solo puedes cambiar a Testing");
      return;
    }

    if (userRole === "Tester" && taskState === "Testing" && selectedState !== "Completed") {
      setError("Como Tester, solo puedes cambiar a Completed");
      return;
    }

    if (selectedState === taskState) {
      setError("No hay cambios para guardar");
      return;
    }

    updateTaskState();
  };

  // -------------------------------------------
  //   Cerrar modal
  // -------------------------------------------
  const handleClose = () => {
    setError("");
    setSelectedState(taskState); 
    onHide();
  };

  // -------------------------------------------
  //   Cambios del select
  // -------------------------------------------
  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setError("");
    setIsSaved(false);
  };

  // -------------------------------------------
  //   Opciones disponibles
  // -------------------------------------------
  const getAvailableOptions = () => {
    if (isSaved) return [taskState];

    if (userRole === "Developer" && taskState === "Development") {
      return ["Development", "Testing"];
    }

    if (userRole === "Tester" && taskState === "Testing") {
      return ["Testing", "Completed"];
    }

    return [taskState];
  };

  // -------------------------------------------
  //   ¿Puede editar?
  // -------------------------------------------
  const canUserEdit = () => {
    if (isSaved) return false;

    if (userRole === "Developer" && taskState === "Development") return true;
    if (userRole === "Tester" && taskState === "Testing") return true;

    return false;
  };

  // Badge visual
  const getStateBadge = (state) => {
    switch (state) {
      case "Development": return <Badge bg="primary" className="ms-2">En Desarrollo</Badge>;
      case "Testing": return <Badge bg="warning" className="ms-2">En Testing</Badge>;
      case "Completed": return <Badge bg="success" className="ms-2">Completada</Badge>;
      default: return <Badge bg="secondary" className="ms-2">{state}</Badge>;
    }
  };

  const getStateDescription = () => {
    if (!isSaved && selectedState !== taskState) {
      return `Cambio pendiente: ${taskState} → ${selectedState}`;
    }

    switch (taskState) {
      case "Development":
        return userRole === "Developer"
          ? "Puedes cambiar esta tarea a Testing cuando termines el desarrollo."
          : "El Developer está trabajando en esta tarea.";
      case "Testing":
        return userRole === "Tester"
          ? "Puedes cambiar esta tarea a Completed cuando termines las pruebas."
          : "La tarea está en testing.";
      case "Completed":
        return "La tarea ha sido completada.";
      default:
        return "Estado actual de la tarea.";
    }
  };

  const getPermissionMessage = () => {
    if (isSaved) return "✅ Estado guardado";
    if (canUserEdit()) return "📝 Puedes cambiar el estado";
    return "❌ No puedes modificar este estado";
  };

  const availableOptions = getAvailableOptions();
  const canEdit = canUserEdit();
  const hasChanges = selectedState !== taskState && !isSaved;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Editar Tarea 
          {getStateBadge(isSaved ? taskState : selectedState)}
          {hasChanges && <Badge bg="info" className="ms-2">Cambios pendientes</Badge>}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="mb-4 p-3 border rounded bg-light">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">{isSaved ? "Estado Guardado:" : "Estado Actual:"}</h6>
            <span className={`badge ${canEdit ? "bg-warning" : isSaved ? "bg-success" : "bg-secondary"}`}>
              {canEdit ? "Editable" : isSaved ? "Guardado" : "No editable"}
            </span>
          </div>
          <p className="mb-0 text-muted small">{getStateDescription()}</p>
        </div>

        <h5>{task?.nombre || task?.taskName}</h5>
        <p className="text-muted">{task?.descripcion || task?.taskDescription}</p>

        <Form.Group className="mb-4">
          <Form.Label>
            Estado de la Tarea
            <span className="ms-2 text-muted small">({getPermissionMessage()})</span>
          </Form.Label>

          <Form.Select
            value={selectedState}
            onChange={handleStateChange}
            disabled={!canEdit || loading}
          >
            {availableOptions.map((option) => (
              <option key={option} value={option}>
                {option === "Development" && "En Desarrollo"}
                {option === "Testing" && "En Testing"} 
                {option === "Completed" && "Completada"}
              </option>
            ))}
          </Form.Select>

          {hasChanges && (
            <Form.Text className="text-warning">
              ⚠ Cambio pendiente: {taskState} → {selectedState}
            </Form.Text>
          )}
        </Form.Group>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Guardando cambios...</p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>

        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={loading || !hasChanges || !canEdit}
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditTask;
