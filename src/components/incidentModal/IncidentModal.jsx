import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { BsExclamationCircleFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import './incidentModal.css';

// ⭐ TIPOS DE INCIDENCIA ACTUALIZADOS INCLUYENDO "Recursos"
const tiposDeIncidencia = [
  "Humano",
  "Tecnológico", 
  "Material",
  "Recursos",
  "Externo",
];

const IncidentModal = ({ show, onHide, onSubmit, incidenceData, isLoading, projectId }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm({
    mode: "onChange",
    defaultValues: {
      tipo: "",
      descripcion: ""
    }
  });

  // Watch para contador de caracteres
  const watchDescripcion = watch("descripcion", "");

  // Efecto para cargar datos cuando se edita
  useEffect(() => {
    if (incidenceData) {
      // Modo edición
      setValue("tipo", incidenceData.typeIncidence || incidenceData.tipo || "");
      setValue("descripcion", incidenceData.descriptionIncidence || incidenceData.descripcion || "");
    } else {
      // Modo creación - resetear
      reset({
        tipo: "",
        descripcion: ""
      });
    }
    // Limpiar alert cuando se abre/cierra el modal
    setShowAlert(false);
  }, [incidenceData, show, reset, setValue]);

  // Función para mostrar alertas
  const showAlertMessage = (message, variant = "success") => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
  };

  const handleClose = () => {
    reset();
    setShowAlert(false);
    onHide();
  };

 const onSubmitForm = async (data) => {
  try {
    const payload = {
      tipo: data.tipo,
      descripcion: data.descripcion.trim()
    };

    if (onSubmit) {
      // Esperamos el resultado del padre
      const success = await onSubmit(payload);

      // ⭐ Solo si el padre devolvió true (éxito)
      if (success) {
        // 1. Mostrar alerta DENTRO del modal
        showAlertMessage(
          incidenceData 
            ? "¡Incidencia actualizada exitosamente!" 
            : "¡Incidencia registrada exitosamente!",
          "success"
        );
        
        // 2. Esperar 1.5 o 2 segundos para que el usuario lea el mensaje
        setTimeout(() => {
            handleClose(); // Esto llamará al onHide del padre
        }, 1500);
      }
    }
  } catch (error) {
    showAlertMessage(
      error.message || "Error al procesar la incidencia",
      "danger"
    );
  }
};

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <BsExclamationCircleFill className="text-warning me-2" />
          {incidenceData ? "Editar Incidencia" : "Registrar Incidencia"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmitForm)} noValidate>
        <Modal.Body>
          <Alert 
            show={showAlert} 
            variant={alertVariant} 
            dismissible 
            onClose={() => setShowAlert(false)}
            className="mb-3"
          >
            {alertMessage}
          </Alert>

          {/* ⭐ INFORMACIÓN DEL PROYECTO (solo lectura) */}
          {projectId && (
            <Form.Group className="mb-3">
              <Form.Label>Proyecto ID</Form.Label>
              <Form.Control
                type="text"
                value={projectId}
                disabled
                readOnly
              />
              <Form.Text className="text-muted">
                ID del proyecto asociado a esta incidencia
              </Form.Text>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>
              Tipo de Incidencia <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              {...register("tipo", {
                required: "El tipo de incidencia es obligatorio",
                validate: value => value !== "" || "Seleccione un tipo de incidencia"
              })}
              isInvalid={!!errors.tipo}
            >
              <option value="">Seleccionar tipo de incidencia</option>
              {tiposDeIncidencia.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.tipo?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Descripción de la Incidencia <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Ej: Licencia presentada por un administrador..."
              {...register("descripcion", {
                required: "La descripción es obligatoria",
                minLength: {
                  value: 10,
                  message: "La descripción debe tener al menos 10 caracteres"
                },
                maxLength: {
                  value: 60,
                  message: "La descripción no puede exceder 60 caracteres"
                },
                pattern: {
                  value: /^(?![0-9]+$)[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_.,()]+$/,
                  message: "La descripción no puede contener solo números ni caracteres inválidos"
                },
                validate: {
                  notOnlySpaces: value => 
                    value.trim().length > 0 || "La descripción no puede contener solo espacios",
                  meaningfulContent: value => 
                    value.trim().split(' ').length >= 3 || "La descripción debe ser más específica (mínimo 3 palabras)"
                }
              })}
              isInvalid={!!errors.descripcion}
            />
            <Form.Control.Feedback type="invalid">
              {errors.descripcion?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Describa detalladamente la incidencia, incluyendo el impacto y las
              acciones necesarias. {watchDescripcion.length}/60 caracteres
            </Form.Text>
          </Form.Group>

          {/* Alert para errores de validación */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="warning" className="py-2">
              <small>
                <strong>Por favor corrige los siguientes campos:</strong>
                <ul className="mb-0 mt-1">
                  {errors.tipo && <li>Tipo de incidencia</li>}
                  {errors.descripcion && <li>Descripción de la incidencia</li>}
                </ul>
              </small>
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button 
            className="btn-cancelar-incidencia" 
            variant="light" 
            onClick={handleClose} 
            disabled={isLoading || isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            className="btn-registrar-incidencia" 
            variant="warning" 
            type="submit" 
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? "Guardando..." : (incidenceData ? "Actualizar" : "Registrar")} Incidencia
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default IncidentModal;