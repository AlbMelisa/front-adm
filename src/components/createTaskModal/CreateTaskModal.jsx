import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  ToggleButtonGroup,
  ToggleButton,
  Badge,
} from "react-bootstrap";

const mockResponsables = [
  "Juan Pérez",
  "María González",
  "Carlos Sánchez",
  "Ana López",
];

const mockRecursos = [
  "Diseñador UI/UX",
  "Desarrollador Backend",
  "Licencia Software",
  "Servidor de Pruebas",
];

const priorityMap = {
  Baja: 0,
  Media: 1,
  Alta: 2,
  Crítica: 3,
};

const CreateTaskModal = ({show, onHide, idFunction}) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [responsable, setResponsable] = useState(mockResponsables[0]); // Campo de UI
  const [dateEnd, setDateEnd] = useState("");
  const [priority, setPriority] = useState("Media"); // Valor string de la UI

  const [recursosAsignados, setRecursosAsignados] = useState([]);
  const [recursoSeleccionado, setRecursoSeleccionado] = useState(
    mockRecursos[0]
  );

  const resetForm = () => {
    setTaskName("");
    setTaskDescription("");
    setResponsable(mockResponsables[0]);
    setDateEnd("");
    setPriority("Media");
    setRecursosAsignados([]);
    setRecursoSeleccionado(mockRecursos[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      idFunction: idFunction,
      taskName: taskName,
      taskDescription: taskDescription,
      priority: priorityMap[priority],
      dateEnd: dateEnd,
    };

    console.log("Enviando Payload a la API:", payload);

    try {
      // --- Lógica de API ---
      // const response = await fetch("URL_DE_TU_API/tasks", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      //
      // if (!response.ok) {
      //   throw new Error("Error al crear la tarea");
      // }

      // const newTask = await response.json();
      // console.log("Tarea creada:", newTask);
      // ---------------------

      // Si la API fue exitosa, cierra y resetea
      handleCloseAndReset();
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      // Aquí podrías mostrar una alerta de error
    }
  };

  /**
   * Agrega un recurso a la lista (solo UI).
   */
  const handleAddRecurso = () => {
    if (
      recursoSeleccionado &&
      !recursosAsignados.includes(recursoSeleccionado)
    ) {
      setRecursosAsignados([...recursosAsignados, recursoSeleccionado]);
    }
  };

  
  const handleRemoveRecurso = (recursoARemover) => {
    setRecursosAsignados(
      recursosAsignados.filter((r) => r !== recursoARemover)
    );
  };


  const handleCloseAndReset = () => {
    resetForm();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleCloseAndReset} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Crear Nueva Tarea</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="text-muted">
            Complete todos los campos para crear una nueva tarea
          </p>

          <Form.Group className="mb-3">
            <Form.Label>
              Nombre de la Tarea <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Implementar sistema de autenticación"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Descripción <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe los detalles y objetivos de la tarea..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Responsable <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={responsable}
                  onChange={(e) => setResponsable(e.target.value)}
                  required
                >
                  {mockResponsables.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Fecha de Finalización Estimada{" "}
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Prioridad</Form.Label>
            {/* ToggleButtonGroup maneja el estado "activo" automáticamente */}
            <ToggleButtonGroup
              type="radio"
              name="priority"
              value={priority}
              onChange={setPriority}
              className="w-100 d-flex gap-2"
            >
              <ToggleButton id="p-baja" value="Baja" variant="outline-success">
                Baja
              </ToggleButton>
              <ToggleButton
                id="p-media"
                value="Media"
                variant="outline-primary"
              >
                Media
              </ToggleButton>
              <ToggleButton id="p-alta" value="Alta" variant="outline-warning">
                Alta
              </ToggleButton>
              <ToggleButton
                id="p-critica"
                value="Crítica"
                variant="outline-danger"
              >
                Crítica
              </ToggleButton>
            </ToggleButtonGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Recursos Necesarios</Form.Label>
            <InputGroup>
              <Form.Select
                value={recursoSeleccionado}
                onChange={(e) => setRecursoSeleccionado(e.target.value)}
              >
                {mockRecursos.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Form.Select>
              <Button variant="dark" onClick={handleAddRecurso}>
                Agregar
              </Button>
            </InputGroup>

            <div
              className="mt-2 p-2 border rounded"
              style={{ minHeight: "50px" }}
            >
              {recursosAsignados.length === 0 ? (
                <p className="text-muted small mb-0">
                  No hay recursos asignados. Selecciona recursos del menú
                  superior.
                </p>
              ) : (
                <div>
                  {recursosAsignados.map((r) => (
                    <Badge
                      key={r}
                      pill
                      bg="secondary"
                      className="me-2 p-2"
                      onClick={() => handleRemoveRecurso(r)}
                      style={{ cursor: "pointer" }}
                    >
                      {r} &times;
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleCloseAndReset}>
            Cancelar
          </Button>
          <Button variant="dark" type="submit">
            Crear Tarea
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;
