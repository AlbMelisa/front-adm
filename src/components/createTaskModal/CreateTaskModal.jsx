import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
  InputGroup,
  Alert,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import "../../pages/createProject/createProject.css";

const priorityMapToApi = { Baja: 0, Media: 1, Alta: 2 };
const priorityMapFromApi = { 0: "Baja", 1: "Media", 2: "Alta" };

const CreateTaskModal = ({
  show,
  onHide,
  idFunction,
  taskData,
  isLoading,
  onTaskAdded,
}) => {
  const isEditMode = !!taskData;
  const [allResources, setAllResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [assignedResources, setAssignedResources] = useState([]);
  const [resourcesError, setResourcesError] = useState(null);
  const [internalFunctionId, setInternalFunctionId] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    trigger,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      taskName: "",
      taskDescription: "",
      dateEnd: "",
      priority: "Media",
      assignedResources: [],
    },
  });

  // Watch para contadores de caracteres
  const watchTaskName = watch("taskName", "");
  const watchTaskDescription = watch("taskDescription", "");
  const watchAssignedResources = watch("assignedResources", []);

  useEffect(() => {
    if (show) {
      setInternalFunctionId(idFunction);
    }
  }, [show, idFunction]);

  // Validación personalizada para recursos asignados
  const validateAssignedResources = (value) => {
    if (!value || value.length === 0) {
      return "Debe asignar al menos un recurso";
    }
    return true;
  };

  // Validación personalizada para fecha futura
  const validateFutureDate = (value) => {
    if (!value) {
      return "La fecha límite es obligatoria";
    }

    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return "La fecha no puede ser anterior a hoy";
    }

    return true;
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

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

  const fetchResources = async () => {
    try {
      const tokenValidation = verifyToken();
      if (!tokenValidation.isValid) {
        setResourcesError("Error de autenticación al cargar recursos");
        return;
      }

      const resp = await fetch("http://localhost:5111/api/Resource/", {
        headers: {
          Authorization: `Bearer ${tokenValidation.token}`,
        },
      });

      if (resp.status === 401) {
        localStorage.removeItem("token");
        setResourcesError(
          "Sesión expirada. Por favor, inicia sesión nuevamente."
        );
        return;
      }

      if (!resp.ok) {
        throw new Error(`Error ${resp.status} al cargar recursos`);
      }

      const data = await resp.json();

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
      if (resourcesList.length > 0)
        setSelectedResource(resourcesList[0].idResource);
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
        setValue("taskName", taskData.taskName || taskData.nombre || "");
        setValue(
          "taskDescription",
          taskData.taskDescription || taskData.descripcion || ""
        );

        let fDate = taskData.dateEnd || taskData.fechaFin || "";
        if (fDate && fDate.includes("T")) fDate = fDate.split("T")[0];
        setValue("dateEnd", fDate);

        setValue("priority", priorityMapFromApi[taskData.priority] || "Media");

        const resources = taskData.resourceList || taskData.resource || [];
        setAssignedResources(Array.isArray(resources) ? resources : []);
        setValue(
          "assignedResources",
          Array.isArray(resources) ? resources : []
        );
      } else {
        resetForm();
      }
    }
  }, [show, isEditMode, taskData, setValue]);

  const resetForm = () => {
    reset({
      taskName: "",
      taskDescription: "",
      dateEnd: "",
      priority: "Media",
      assignedResources: [],
    });
    setAssignedResources([]);
    setResourcesError(null);
    setShowSuccessAlert(false);
    if (allResources.length > 0) {
      setSelectedResource(allResources[0].idResource);
    }
  };

  const handleAddResource = async () => {
    if (selectedResource && !assignedResources.includes(selectedResource)) {
      const newResources = [...assignedResources, selectedResource];
      setAssignedResources(newResources);
      setValue("assignedResources", newResources);
      await trigger("assignedResources");
    }
  };

  const handleRemoveResource = async (id) => {
    const newResources = assignedResources.filter((r) => r !== id);
    setAssignedResources(newResources);
    setValue("assignedResources", newResources);
    await trigger("assignedResources");
  };

  const onSubmit = async (data) => {
    const tokenValidation = verifyToken();
    if (!tokenValidation.isValid) {
      alert(`Error de autenticación: ${tokenValidation.message}`);
      return;
    }

    const payload = {
      idFunction: internalFunctionId,
      taskName: data.taskName.trim(),
      taskDescription: data.taskDescription.trim(),
      priority: priorityMapToApi[data.priority],
      dateEnd: data.dateEnd,
      resourceList: data.assignedResources,
    };

    console.log("Enviando tarea:", payload);

    try {
      const response = await fetch("http://localhost:5111/api/Task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenValidation.token}`,
        },
        body: JSON.stringify(payload),
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

      setShowSuccessAlert(true);

      // ✅ REFRESCAR LA PÁGINA DESPUÉS DE 1.5 SEGUNDOS
      setTimeout(() => {
        handleCloseAndReset();
        window.location.reload(); // 🔄 Esto refresca toda la página
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCloseAndReset = () => {
    onHide();
    setTimeout(() => resetForm(), 200);
  };

  return (
    <Modal show={show} onHide={handleCloseAndReset} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditMode ? "Modificar Tarea" : "Crear Nueva Tarea"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body>
          {showSuccessAlert && (
            <Alert variant="success" className="mb-3">
              <Alert.Heading className="h6 mb-1">✅ ¡Éxito!</Alert.Heading>
              <p className="mb-0">Tarea creada exitosamente</p>
              <small className="text-muted">
                La página se refrescará automáticamente...
              </small>
            </Alert>
          )}

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
            <Form.Label>Nombre de la Tarea *</Form.Label>
            <Form.Control
              type="text"
              {...register("taskName", {
                required: "El nombre de la tarea es obligatorio",
                minLength: {
                  value: 5,
                  message: "El nombre debe tener al menos 5 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "El nombre no puede exceder 50 caracteres",
                },
                pattern: {
                  value: /^(?![0-9]+$)[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_.,()]+$/,
                  message:
                    "El nombre no puede contener solo números ni caracteres no válidos",
                },
              })}
              isInvalid={!!errors.taskName}
              placeholder="Ingresa el nombre de la tarea"
            />
            <Form.Control.Feedback type="invalid">
              {errors.taskName?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              {watchTaskName.length}/50 caracteres
            </Form.Text>
          </Form.Group>

          {/* DESCRIPCIÓN - MÁXIMO 40 CARACTERES */}
          <Form.Group className="mb-3">
            <Form.Label>Descripción *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register("taskDescription", {
                required: "La descripción es obligatoria",
                minLength: {
                  value: 20,
                  message: "La descripción debe tener al menos 20 caracteres",
                },
                maxLength: {
                  value: 150, // ✅ MÁXIMO 40 CARACTERES
                  message: "La descripción no puede exceder 150 caracteres",
                },
                pattern: {
                  // (?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ]) -> Lookahead: Busca al menos una letra (con o sin tilde/ñ)
                  // [\s\S]+ -> Permite CUALQUIER cosa (letras, números, saltos de línea, emojis, : / " ' etc.)
                  value: /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ])[\s\S]+$/,
                  message:
                    "La descripción debe contener texto explicativo, no solo números o símbolos",
                },
                validate: {
                  notOnlySpaces: (value) =>
                    value.trim().length > 0 ||
                    "La descripción no puede contener solo espacios",
                  meaningfulContent: (value) =>
                    value.trim().split(" ").length >= 3 ||
                    "La descripción debe ser más específica (mínimo 3 palabras)",
                },
              })}
              isInvalid={!!errors.taskDescription}
              placeholder="Describe la tarea en detalle"
            />
            <Form.Control.Feedback type="invalid">
              {errors.taskDescription?.message}
            </Form.Control.Feedback>
            <Form.Text
              className={`${
                watchTaskDescription.length > 40 ? "text-danger" : "text-muted"
              }`}
            >
              {watchTaskDescription.length}/150 caracteres
            </Form.Text>
          </Form.Group>

          <Row>
            <Col md={6}>
              {/* FECHA */}
              <Form.Group className="mb-3">
                <Form.Label>Fecha Límite *</Form.Label>
                <Form.Control
                  type="date"
                  {...register("dateEnd", {
                    required: "La fecha límite es obligatoria",
                    validate: validateFutureDate,
                  })}
                  isInvalid={!!errors.dateEnd}
                  min={getMinDate()}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dateEnd?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              {/* PRIORIDAD */}
              <Form.Group className="mb-3">
                <Form.Label>Prioridad *</Form.Label>
                <div>
                  <input
                    type="hidden"
                    {...register("priority", {
                      required: "La prioridad es obligatoria",
                    })}
                  />
                  <ToggleButtonGroup
                    type="radio"
                    name="priority"
                    value={watch("priority", "Media")}
                    onChange={(val) => setValue("priority", val)}
                    className="w-100 d-flex gap-2"
                  >
                    <ToggleButton
                      id="priority-low"
                      value="Baja"
                      variant={
                        watch("priority") === "Baja"
                          ? "success"
                          : "outline-success"
                      }
                    >
                      Baja
                    </ToggleButton>
                    <ToggleButton
                      id="priority-medium"
                      value="Media"
                      variant={
                        watch("priority") === "Media"
                          ? "primary"
                          : "outline-primary"
                      }
                    >
                      Media
                    </ToggleButton>
                    <ToggleButton
                      id="priority-high"
                      value="Alta"
                      variant={
                        watch("priority") === "Alta"
                          ? "warning"
                          : "outline-warning"
                      }
                    >
                      Alta
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
                {errors.priority && (
                  <div className="text-danger small mt-1">
                    {errors.priority.message}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* RECURSOS */}
          <Form.Group className="mb-3">
            <Form.Label>Asignar Recursos *</Form.Label>

            {resourcesError && (
              <div className="alert alert-warning py-2">
                <small>No hay recursos</small>
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

            {/* Campo oculto para validación de recursos */}
            <input
              type="hidden"
              {...register("assignedResources", {
                validate: validateAssignedResources,
              })}
            />

            {/* Lista de recursos asignados */}
            <div
              className={`mt-2 p-2 border rounded ${
                errors.assignedResources ? "border-danger" : ""
              }`}
            >
              <Form.Label className="small mb-2">
                Recursos asignados:
              </Form.Label>
              {assignedResources.length === 0 ? (
                <p className="text-muted small mb-0">
                  No hay recursos asignados.
                </p>
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
            {errors.assignedResources && (
              <div className="text-danger small mt-1">
                {errors.assignedResources.message}
              </div>
            )}
          </Form.Group>

          {/* Mensaje de campos obligatorios */}
          <div className="text-muted small">* Campos obligatorios</div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="light"
            onClick={handleCloseAndReset}
            disabled={isSubmitting || isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="dark"
            type="submit"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading
              ? "Procesando..."
              : isEditMode
              ? "Guardar Cambios"
              : "Crear Tarea"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;
