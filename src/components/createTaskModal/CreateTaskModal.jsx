import React, { useState, useEffect } from "react";
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

// --- (Mocks y Mapas de Prioridad no cambian) ---
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
const priorityMapToApi = { Baja: 0, Media: 1, Alta: 2, Crítica: 3 };
const priorityMapFromApi = { 0: "Baja", 1: "Media", 2: "Alta", 3: "Crítica" };

/**
 * Modal para CREAR o EDITAR una tarea.
 */
const CreateTaskModal = ({ show, onHide, idFunction, taskData }) => {
  const isEditMode = !!taskData;

  // --- Estados del Formulario ---
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [responsable, setResponsable] = useState(mockResponsables[0]);
  const [dateEnd, setDateEnd] = useState("");
  const [priority, setPriority] = useState("Media");
  
  // ✅ 1. Nuevo estado para el "Estado de la Tarea"
  const [estado, setEstado] = useState("Pendiente"); 

  const [recursosAsignados, setRecursosAsignados] = useState([]);
  const [recursoSeleccionado, setRecursoSeleccionado] = useState(mockRecursos[0]);

  /**
   * ✅ 3. useEffect actualizado
   * Rellena el formulario cuando se abre en modo Edición
   */
  useEffect(() => {
    if (show) {
      if (isEditMode && taskData) {
        // --- MODO EDICIÓN ---
        setTaskName(taskData.nombre || "");
        setTaskDescription(taskData.descripcion || "");
        setDateEnd(taskData.dateEnd || "");
        setPriority(priorityMapFromApi[taskData.prioridad] || "Media");
        setResponsable(taskData.responsable || mockResponsables[0]);
        setRecursosAsignados(taskData.recursos || []);
        
        // Setea el estado
        setEstado(taskData.estado || "Pendiente");

      } else {
        // --- MODO CREACIÓN ---
        resetForm();
      }
    }
  }, [show, taskData, isEditMode]);

  /**
   * ✅ 4. resetForm actualizado
   * Limpia el formulario y establece valores por defecto
   */
  const resetForm = () => {
    setTaskName("");
    setTaskDescription("");
    setResponsable(mockResponsables[0]);
    setDateEnd("");
    setPriority("Media");
    setRecursosAsignados([]);
    setRecursoSeleccionado(mockRecursos[0]);
    
    // Resetea el estado
    setEstado("Pendiente"); 
  };

  /**
   * ✅ 5. handleSubmit actualizado
   * Envía TODOS los campos del formulario a la API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ahora el payload incluye todos los campos del formulario
    const payload = {
      taskName: taskName,
      taskDescription: taskDescription,
      priority: priorityMapToApi[priority],
      dateEnd: dateEnd,
      estado: estado,                   // <-- AÑADIDO
      responsable: responsable,         // <-- AÑADIDO
      recursos: recursosAsignados,    // <-- AÑADIDO
    };

    try {
      if (isEditMode) {
        // --- LÓGICA DE EDICIÓN (PUT / PATCH) ---
        console.log(`Enviando Payload (PATCH) a /tasks/${taskData.id}:`, payload);
        // ... (Tu fetch 'PATCH' aquí) ...

      } else {
        // --- LÓGICA DE CREACIÓN (POST) ---
        const createPayload = { ...payload, idFunction: idFunction };
        console.log("Enviando Payload (POST) a /tasks:", createPayload);
        // ... (Tu fetch 'POST' aquí) ...
      }

      handleCloseAndReset();

    } catch (error) {
      console.error("Error en handleSubmit:", error);
    }
  };

  // ... (handleAddRecurso y handleRemoveRecurso no cambian) ...

  const handleAddRecurso = () => {
    if (recursoSeleccionado && !recursosAsignados.includes(recursoSeleccionado)) {
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
        <Modal.Title>
          {isEditMode ? "Modificar Tarea" : "Crear Nueva Tarea"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* ... (Nombre y Descripción no cambian) ... */}
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
                    <option key={r} value={r}>{r}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Fecha de Finalización Estimada <span className="text-danger">*</span>
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

          <Row className="mb-3">
            <Col md={6}>
              {/* ✅ 2. Campo de Formulario para el Estado */}
              <Form.Group>
                <Form.Label>Estado <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  required
                >
                  {/* Deshabilita "Completada" si es una tarea nueva
                      (opcional, pero buena práctica) */}
                  {!isEditMode && (
                    <option value="Pendiente">Pendiente</option>
                  )}
                  {isEditMode && (
                    <>
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Progreso">En Progreso</option>
                      <option value="Completada">Completada</option>
                    </>
                  )}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
               <Form.Group>
                 <Form.Label>Prioridad</Form.Label>
                 <ToggleButtonGroup
                   type="radio"
                   name="priority"
                   value={priority}
                   onChange={setPriority}
                   className="w-100 d-flex gap-2"
                 >
                   <ToggleButton id="p-baja" value="Baja" variant="outline-success">Baja</ToggleButton>
                   <ToggleButton id="p-media" value="Media" variant="outline-primary">Media</ToggleButton>
                   <ToggleButton id="p-alta" value="Alta" variant="outline-warning">Alta</ToggleButton>
                   <ToggleButton id="p-critica" value="Crítica" variant="outline-danger">Crítica</ToggleButton>
                 </ToggleButtonGroup>
               </Form.Group>
            </Col>
          </Row>

          {/* ... (Recursos Necesarios no cambia) ... */}
           <Form.Group className="mb-3">
             <Form.Label>Recursos Necesarios</Form.Label>
             <InputGroup>
               <Form.Select
                 value={recursoSeleccionado}
                 onChange={(e) => setRecursoSeleccionado(e.target.value)}
               >
                 {mockRecursos.map((r) => (
                   <option key={r} value={r}>{r}</option>
                 ))}
               </Form.Select>
               <Button variant="dark" onClick={handleAddRecurso}>
                 Agregar
               </Button>
             </InputGroup>
             <div className="mt-2 p-2 border rounded" style={{ minHeight: "50px" }}>
               {recursosAsignados.length === 0 ? (
                 <p className="text-muted small mb-0">No hay recursos asignados.</p>
               ) : (
                 <div>
                   {recursosAsignados.map((r) => (
                     <Badge
                       key={r} pill bg="secondary" className="me-2 p-2"
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
            {isEditMode ? "Guardar Cambios" : "Crear Tarea"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;