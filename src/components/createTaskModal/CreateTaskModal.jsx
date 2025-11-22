import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
  InputGroup
} from "react-bootstrap";

const priorityMapToApi = { Baja: 0, Media: 1, Alta: 2 };
const priorityMapFromApi = { 0: "Baja", 1: "Media", 2: "Alta" };

const CreateTaskModal = ({ show, onHide,idFunction, taskData, isLoading }) => {
  const isEditMode = !!taskData;
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [priority, setPriority] = useState("Media");
  const [allResources, setAllResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [assignedResources, setAssignedResources] = useState([]);
  const [resourcesError, setResourcesError] = useState(null);
  const [internalFunctionId, setInternalFunctionId] = useState(null);

useEffect(() => {
  if (show) {
    setInternalFunctionId(idFunction);
  }
}, [show, idFunction]);
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


  const fetchResources = async () => {
    try {
      const tokenValidation = verifyToken();
      if (!tokenValidation.isValid) {
        setResourcesError("Error de autenticación al cargar recursos");
        return;
      }

      const resp = await fetch("http://localhost:5111/api/Resource/", {
        headers: {
          "Authorization": `Bearer ${tokenValidation.token}`
        }
      });

      if (resp.status === 401) {
        localStorage.removeItem("token");
        setResourcesError("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }

      if (!resp.ok) {
        throw new Error(`Error ${resp.status} al cargar recursos`);
      }

      const data = await resp.json();
      
      // Normalizar datos
      let resourcesList = [];
      if (Array.isArray(data)) {
        resourcesList = data;
      } else if (data.resourcesList && Array.isArray(data.resourcesList)) {
        resourcesList = data.resourcesList;
      } else if (data.resources && Array.isArray(data.resources)) {
        resourcesList = data.resources;
      } else if (data.data && Array.isArray(data.data)) {
        resourcesList = data.data;
      }
      
      setAllResources(resourcesList);
      if (resourcesList.length > 0) setSelectedResource(resourcesList[0].idResource);
      setResourcesError(null);

    } catch (error) {
      console.error("Error cargando recursos:", error);
      setResourcesError(error.message);
    }
  };

  useEffect(() => {
    if (show) {
      fetchResources();

      if (isEditMode && taskData) {
        setTaskName(taskData.taskName || taskData.nombre || "");
        setTaskDescription(taskData.taskDescription || taskData.descripcion || "");
        
        let fDate = taskData.dateEnd || taskData.fechaFin || "";
        if(fDate && fDate.includes("T")) fDate = fDate.split("T")[0];
        setDateEnd(fDate);

        setPriority(priorityMapFromApi[taskData.priority] || "Media");

        const resources = taskData.resourceList || taskData.resource || [];
        setAssignedResources(Array.isArray(resources) ? resources : []);
      } else {
        resetForm();
      }
    }
  }, [show]); // <--- SOLO DEPENDE DE 'SHOW' PARA NO BORRAR LO QUE ESCRIBES

  // Reset form
  const resetForm = () => {
    setTaskName("");
    setTaskDescription("");
    setDateEnd("");
    setPriority("Media");
    setAssignedResources([]);
    if (allResources.length > 0) {
        setSelectedResource(allResources[0].idResource);
    }
    setResourcesError(null);
  };

  const handleAddResource = () => {
    if (selectedResource && !assignedResources.includes(selectedResource)) {
      setAssignedResources([...assignedResources, selectedResource]);
    }
  };

  const handleRemoveResource = (id) => {
    setAssignedResources(assignedResources.filter((r) => r !== id));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskName.trim() || !taskDescription.trim()) {
        alert("Nombre y descripción son obligatorios");
        return;
    }

    const tokenValidation = verifyToken();
    if (!tokenValidation.isValid) {
      alert(`Error de autenticación: ${tokenValidation.message}`);
      return;
    }

    // Payload garantizado sin undefined
    const payload = {
      idFunction: internalFunctionId,
      taskName: taskName,
      taskDescription: taskDescription,
      priority: priorityMapToApi[priority],
      dateEnd: dateEnd,
      resourceList: assignedResources
    };

    console.log("Enviando tarea:", payload);

    try {
     
        const response = await fetch("http://localhost:5111/api/Task", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenValidation.token}`
          },
          body: JSON.stringify(payload)
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          throw new Error("Sesión expirada.");
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || response.statusText);
        }

        const result = await response.json();
        handleCloseAndReset();
        alert("Tarea creada exitosamente");

    } catch (error) {
      console.error("Error:", error);
      alert(`Error al crear la tarea: ${error.message}`);
    }
  };

  const handleCloseAndReset = () => {
    onHide();
    // Pequeño timeout para limpiar visualmente después de cerrar
    setTimeout(() => resetForm(), 200);
  };

  return (
    <Modal show={show} onHide={handleCloseAndReset} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>+
          {isEditMode ? "Modificar Tarea" : "Crear Nueva Tarea"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* ID de la funcionalidad */}
          <Form.Group className="mb-3">
            <Form.Label>ID de Funcionalidad</Form.Label>
            <Form.Control
              type="text"
              value={internalFunctionId || ""}
              readOnly
              disabled
              className="bg-light"
            />
            <Form.Text className="text-muted">
              Esta tarea se asociará a esta funcionalidad
            </Form.Text>
          </Form.Group>

          {/* NOMBRE */}
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la Tarea</Form.Label>
            <Form.Control
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              placeholder="Ingresa el nombre de la tarea"
            />
          </Form.Group>

          {/* DESCRIPCIÓN */}
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              required
              placeholder="Describe la tarea en detalle"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              {/* FECHA */}
              <Form.Group className="mb-3">
                <Form.Label>Fecha Límite</Form.Label>
                <Form.Control
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              {/* PRIORIDAD */}
              <Form.Group className="mb-3">
                <Form.Label>Prioridad</Form.Label>
                <ToggleButtonGroup
                  type="radio"
                  name="priority"
                  value={priority}
                  onChange={setPriority}
                  className="w-100 d-flex gap-2"
                >
                  <ToggleButton id="priority-low" value="Baja" variant={priority === "Baja" ? "success" : "outline-success"}>
                    Baja
                  </ToggleButton>
                  <ToggleButton id="priority-medium" value="Media" variant={priority === "Media" ? "primary" : "outline-primary"}>
                    Media
                  </ToggleButton>
                  <ToggleButton id="priority-high" value="Alta" variant={priority === "Alta" ? "warning" : "outline-warning"}>
                    Alta
                  </ToggleButton>
                </ToggleButtonGroup>
              </Form.Group>
            </Col>
          </Row>

          {/* === SECCIÓN DE RECURSOS RESTAURADA (Tu diseño original) === */}
          <Form.Group className="mb-3">
            <Form.Label>Asignar Recursos</Form.Label>

            {resourcesError && (
              <div className="alert alert-warning py-2">
                <small>{resourcesError}</small>
              </div>
            )}

            <InputGroup>
              <Form.Select
                value={selectedResource || ""}
                onChange={(e) => setSelectedResource(Number(e.target.value))}
                disabled={allResources.length === 0}
              >
                {allResources.length === 0 ? (
                  <option value="">No hay recursos disponibles</option>
                ) : (
                  allResources.map((res) => (
                    <option key={res.idResource} value={res.idResource}>
                      {res.resourceDescription} 
                    </option>
                  ))
                )}
              </Form.Select>

              <Button 
                variant="dark" 
                onClick={handleAddResource}
                disabled={!selectedResource || allResources.length === 0}
              >
                Agregar
              </Button>
            </InputGroup>

            {/* Lista de recursos asignados */}
            <div className="mt-2 p-2 border rounded">
              <Form.Label className="small mb-2">Recursos asignados:</Form.Label>
              {assignedResources.length === 0 ? (
                <p className="text-muted small mb-0">No hay recursos asignados.</p>
              ) : (
                assignedResources.map((id) => {
                  const res = allResources.find((r) => r.idResource === id);
                  return (
                    <span
                      key={id}
                      className="badge bg-secondary p-2 me-2 mb-1"
                      style={{ cursor: "pointer", fontSize: "0.8rem" }}
                      onClick={() => handleRemoveResource(id)}
                      title="Click para eliminar"
                    >
                      {res?.resourceDescription || `ID ${id}`} &times;
                    </span>
                  );
                })
              )}
            </div>
          </Form.Group>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={handleCloseAndReset} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="dark" type="submit" disabled={isLoading}>
            {isLoading ? "Procesando..." : (isEditMode ? "Guardar Cambios" : "Crear Tarea")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;