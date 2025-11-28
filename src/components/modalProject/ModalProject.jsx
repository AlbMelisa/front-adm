import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Card, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";

const ModalProject = ({ show, handleClose, project }) => {
  const [nuevasFunciones, setNuevasFunciones] = useState([]);
  const [showNueva, setShowNueva] = useState(false);
  const [nuevaFunc, setNuevaFunc] = useState({ nombre: "", descripcion: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Configuración de react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch
  } = useForm({
    mode: "onChange",
    defaultValues: {
      budget: 0,
      description: "",
      dateEnd: "",
      changeReason: ""
    }
  });

  // Watch para validaciones en tiempo real
  const watchBudget = watch("budget");
  const watchDateEnd = watch("dateEnd");
  const watchChangeReason = watch("changeReason");

  useEffect(() => {
    if (project) {
      // Establecer valores iniciales del formulario
      setValue("budget", project.budgetProject || 0);
      setValue("description", project.descriptionProject || "");
      
      // Formatear la fecha para el input type="date"
      const formattedDate = project.dateEnd && project.dateEnd !== "0001-01-01" 
        ? project.dateEnd.slice(0, 10) 
        : "";
      setValue("dateEnd", formattedDate);
      
      setNuevasFunciones([]); // Resetear nuevas funciones al abrir el modal
      setValue("changeReason", ""); // Resetear razón del cambio
      setError(""); // Limpiar errores
      setSuccess(""); // Limpiar mensajes de éxito
    }
  }, [project, show, setValue]);

  const agregarFuncionalidad = () => {
    if (!nuevaFunc.nombre.trim()) {
      setError("El nombre de la funcionalidad es requerido");
      return;
    }

    // Validar patrón del nombre de funcionalidad
    const nombrePattern = /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ])[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.,()]{2,50}$/;
    if (!nombrePattern.test(nuevaFunc.nombre.trim())) {
      setError("El nombre de la funcionalidad debe contener al menos una letra y tener entre 2-50 caracteres válidos");
      return;
    }

    // Validar patrón de la descripción si existe
    if (nuevaFunc.descripcion.trim()) {
      const descripcionPattern = /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ])[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.,()]{0,200}$/;
      if (!descripcionPattern.test(nuevaFunc.descripcion.trim())) {
        setError("La descripción solo puede contener letras, números y los siguientes caracteres: -_.,()");
        return;
      }
    }

    setNuevasFunciones([
      ...nuevasFunciones,
      {
        functionName: nuevaFunc.nombre.trim(),
        functionDescription: nuevaFunc.descripcion.trim(),
      },
    ]);

    setNuevaFunc({ nombre: "", descripcion: "" });
    setShowNueva(false);
    setError("");
  };

  const eliminarFuncionalidad = (index) => {
    const nuevas = [...nuevasFunciones];
    nuevas.splice(index, 1);
    setNuevasFunciones(nuevas);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const payload = {
        idProject: project.idProject,
        newDescriptionProject: data.description.trim(),
        newBudgetProject: Number(data.budget),
        dateEnd: data.dateEnd,
        changeReason: data.changeReason.trim(),
        newFunctions: nuevasFunciones,
      };

      console.log("📤 Enviando PATCH a /api/Projects/updateProyect:", payload);

      const response = await fetch("http://localhost:5111/api/Projects/updateProyect", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      console.log("📡 Respuesta del servidor:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ Proyecto actualizado:", result);

      setSuccess("Proyecto actualizado correctamente");
      
      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        handleClose(true); // Indicar que se actualizó correctamente
      }, 2000);

    } catch (err) {
      console.error("❌ Error al actualizar proyecto:", err);
      setError(err.message || "Error al actualizar el proyecto");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setError("");
    setSuccess("");
    setNuevasFunciones([]);
    reset(); // Resetear el formulario
    handleClose(false);
  };

  // Función para validar fecha futura
  const validateFutureDate = (date) => {
    if (!date) return "La fecha es requerida";
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return "La fecha no puede ser anterior a hoy";
    }
    
    return true;
  };

  // Función para validar presupuesto mínimo
  const validateBudget = (value) => {
    const numValue = Number(value);
    if (numValue < 0) return "El presupuesto no puede ser negativo";
    if (numValue > 1000000) return "El presupuesto no puede exceder $1,000,000";
    if (!/^\d+(\.\d{1,2})?$/.test(value)) return "El presupuesto debe tener máximo 2 decimales";
    return true;
  };

  // Patrones de validación
  const patterns = {
    // Permite letras, números, espacios y caracteres especiales comunes, mínimo 1 letra
    textoDescriptivo: /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ])[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.,()!?;:'"]+$/,
    
    // Solo números con máximo 2 decimales
    numeroDecimal: /^\d+(\.\d{1,2})?$/,
    
    // Texto con al menos 3 palabras
    textoConPalabras: /^(?=(?:\S+\s+){2,}\S+).+$/,
    
    // Sin solo números
    noSoloNumeros: /^(?!\d+$).+$/,
    
    // Sin caracteres especiales peligrosos
    sinCaracteresEspeciales: /^[^<>{}[\]\\^`|~]+$/,
    
    // Nombre de funcionalidad
    nombreFuncionalidad: /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ])[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.,()]{2,50}$/
  };

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      size="lg"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Modificar Proyecto</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body>
          {/* Mensajes de alerta */}
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {/* Información del Proyecto */}
          <div className="p-3 mb-4 bg-light rounded">
            <div className="row">
              <div className="col-md-6">
                <p><strong>Nombre:</strong> {project?.nameProject}</p>
                <p><strong>Cliente:</strong> {project?.client?.fullNameClient || project?.clientName}</p>
                <p><strong>Fecha Inicio:</strong> {project?.dateInitial?.slice(0,10)}</p>
              </div>
              <div className="col-md-6">
                <p><strong>ID Proyecto:</strong> {project?.idProject}</p>
                <p><strong>Equipo:</strong> {project?.team?.numberTeam || project?.teamNumber}</p>
                <p><strong>Estado:</strong> {project?.stateProject}</p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <Form.Group className="mb-3">
            <Form.Label>Descripción del Proyecto</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register("description", {
                required: "La descripción es requerida",
                minLength: {
                  value: 10,
                  message: "La descripción debe tener al menos 10 caracteres"
                },
                maxLength: {
                  value: 500,
                  message: "La descripción no puede exceder 500 caracteres"
                },
                pattern: {
                  value: patterns.textoDescriptivo,
                  message: "La descripción debe contener al menos una letra y solo puede incluir letras, números, espacios y los siguientes caracteres: -_.,()!?;:'\""
                },
                validate: {
                  notOnlySpaces: value => 
                    value.trim().length > 0 || "La descripción no puede contener solo espacios",
                  meaningfulContent: value => 
                    value.trim().split(' ').length >= 3 || "La descripción debe contener al menos 3 palabras",
                  noDangerousChars: value =>
                    patterns.sinCaracteresEspeciales.test(value) || "La descripción contiene caracteres no permitidos",
                  notOnlyNumbers: value =>
                    patterns.noSoloNumeros.test(value) || "La descripción no puede contener solo números"
                }
              })}
              isInvalid={!!errors.description}
              placeholder="Describe el proyecto..."
            />
            <Form.Control.Feedback type="invalid">
              {errors.description?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              {watch("description", "")?.length || 0}/500 caracteres - Mínimo 10 caracteres y 3 palabras
            </Form.Text>
          </Form.Group>

          {/* Presupuesto */}
          <Form.Group className="mb-3">
            <Form.Label>Presupuesto del Proyecto ($)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              max="1000000"
              {...register("budget", {
                required: "El presupuesto es requerido",
                validate: validateBudget,
                valueAsNumber: true,
                pattern: {
                  value: patterns.numeroDecimal,
                  message: "Formato inválido. Use máximo 2 decimales (ej: 1500.50)"
                }
              })}
              isInvalid={!!errors.budget}
            />
            <Form.Control.Feedback type="invalid">
              {errors.budget?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Presupuesto válido: $0 - $1,000,000 - Máximo 2 decimales
            </Form.Text>
          </Form.Group>

          {/* Fecha de Finalización */}
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Finalización *</Form.Label>
            <Form.Control
              type="date"
              {...register("dateEnd", {
                required: "La fecha de finalización es requerida",
                validate: validateFutureDate
              })}
              isInvalid={!!errors.dateEnd}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateEnd?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              La fecha debe ser hoy o en el futuro
            </Form.Text>
          </Form.Group>

          {/* Razón del Cambio */}
          <Form.Group className="mb-3">
            <Form.Label>Razón del Cambio *</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              {...register("changeReason", {
                required: "La razón del cambio es obligatoria",
                minLength: {
                  value: 10,
                  message: "La razón debe tener al menos 10 caracteres"
                },
                maxLength: {
                  value: 200,
                  message: "La razón no puede exceder 200 caracteres"
                },
                pattern: {
                  value: patterns.textoDescriptivo,
                  message: "La razón debe contener al menos una letra y solo puede incluir letras, números, espacios y los siguientes caracteres: -_.,()!?;:'\""
                },
                validate: {
                  notOnlySpaces: value => 
                    value.trim().length > 0 || "La razón no puede contener solo espacios",
                  meaningfulContent: value => 
                    value.trim().split(' ').length >= 3 || "La razón debe contener al menos 3 palabras",
                  noDangerousChars: value =>
                    patterns.sinCaracteresEspeciales.test(value) || "La razón contiene caracteres no permitidos",
                  notOnlyNumbers: value =>
                    patterns.noSoloNumeros.test(value) || "La razón no puede contener solo números"
                }
              })}
              isInvalid={!!errors.changeReason}
              placeholder="Explica por qué se realizan estos cambios..."
            />
            <Form.Control.Feedback type="invalid">
              {errors.changeReason?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              {watch("changeReason", "")?.length || 0}/200 caracteres - Mínimo 10 caracteres y 3 palabras
            </Form.Text>
          </Form.Group>

          {/* Nuevas Funcionalidades */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Nuevas Funcionalidades</h5>
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={() => setShowNueva(true)}
              disabled={loading}
              type="button"
            >
              + Agregar Nueva
            </Button>
          </div>

          {/* Lista de nuevas funcionalidades agregadas */}
          {nuevasFunciones.map((func, index) => (
            <Card key={index} className="p-3 mb-2 shadow-sm w-100">
              <div className="d-flex justify-content-between align-items-start w-100">
                <div className="flex-grow-1">
                  <h6 className="mb-1">{func.functionName}</h6>
                  <p className="text-muted mb-0 small">{func.functionDescription}</p>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => eliminarFuncionalidad(index)}
                  disabled={loading}
                  type="button"
                >
                  🗑️
                </Button>
              </div>
            </Card>
          ))}

          {nuevasFunciones.length === 0 && (
            <p className="text-muted text-center mb-3">
              No se han agregado nuevas funcionalidades
            </p>
          )}

          {/* Modal para agregar nueva funcionalidad */}
          {showNueva && (
            <Card className="p-3 mt-3 shadow">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Nueva Funcionalidad</h6>
                <Button 
                  size="sm" 
                  variant="outline-secondary" 
                  onClick={() => {
                    setShowNueva(false);
                    setNuevaFunc({ nombre: "", descripcion: "" });
                  }}
                  type="button"
                >
                  ✕
                </Button>
              </div>

              <Form.Group className="mb-2">
                <Form.Label>Nombre de la funcionalidad *</Form.Label>
                <Form.Control
                  placeholder="Ej: Gestión de sponsors"
                  value={nuevaFunc.nombre}
                  onChange={(e) => setNuevaFunc({ ...nuevaFunc, nombre: e.target.value })}
                  isInvalid={!nuevaFunc.nombre.trim() && nuevaFunc.nombre !== ""}
                  maxLength={50}
                />
                <Form.Control.Feedback type="invalid">
                  {!nuevaFunc.nombre.trim() 
                    ? "El nombre de la funcionalidad es requerido" 
                    : "El nombre debe contener al menos una letra y tener entre 2-50 caracteres válidos"
                  }
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  {nuevaFunc.nombre.length}/50 caracteres - Debe contener al menos una letra
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Describe la funcionalidad..."
                  value={nuevaFunc.descripcion}
                  onChange={(e) => setNuevaFunc({ ...nuevaFunc, descripcion: e.target.value })}
                  maxLength={200}
                />
                <Form.Text className="text-muted">
                  {nuevaFunc.descripcion.length}/200 caracteres - Opcional
                </Form.Text>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button 
                  variant="primary" 
                  onClick={agregarFuncionalidad}
                  disabled={!nuevaFunc.nombre.trim()}
                  type="button"
                >
                  Guardar Funcionalidad
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => {
                    setShowNueva(false);
                    setNuevaFunc({ nombre: "", descripcion: "" });
                  }}
                  type="button"
                >
                  Cancelar
                </Button>
              </div>
            </Card>
          )}

          {/* Resumen de errores de validación */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="warning" className="mt-3">
              <small>
                <strong>Por favor corrige los siguientes campos:</strong>
                <ul className="mb-0 mt-1">
                  {errors.description && <li>Descripción del proyecto</li>}
                  {errors.budget && <li>Presupuesto del proyecto</li>}
                  {errors.dateEnd && <li>Fecha de finalización</li>}
                  {errors.changeReason && <li>Razón del cambio</li>}
                </ul>
              </small>
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleCloseModal}
            disabled={loading}
            type="button"
          >
            Cancelar
          </Button>

          <Button 
            variant="primary" 
            type="submit"
            disabled={loading || !isDirty}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalProject;