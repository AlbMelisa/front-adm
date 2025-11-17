import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsExclamationCircleFill } from "react-icons/bs";

// ⭐ TIPOS DE INCIDENCIA ACTUALIZADOS INCLUYENDO "Recursos"
const tiposDeIncidencia = [
  "Humano",
  "Tecnológico", 
  "Material",
  "Recursos",
  "Externo",
];

const IncidentModal = ({ show, onHide, onSubmit, incidenceData, isLoading, projectId }) => {
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");

  // Efecto para cargar datos cuando se edita
  useEffect(() => {
    if (incidenceData) {
      // Modo edición
      setIncidentType(incidenceData.typeIncidence || incidenceData.tipo || "");
      setDescription(incidenceData.descriptionIncidence || incidenceData.descripcion || "");
    } else {
      // Modo creación - resetear
      setIncidentType("");
      setDescription("");
    }
  }, [incidenceData, show]);

  const handleClose = () => {
    setIncidentType("");
    setDescription("");
    onHide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ⭐ PAYLOAD EXACTO CON SOLO LOS 3 CAMPOS REQUERIDOS
    const payload = {
      tipo: incidentType,
      descripcion: description
    };

    // ✅ Llamar a la función onSubmit del componente padre
    if (onSubmit) {
      await onSubmit(payload);
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

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
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
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              required
            >
              <option value="">Seleccionar tipo de incidencia</option>
              {tiposDeIncidencia.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Descripción de la Incidencia <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Ej: Licencia presentada por un administrador..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Form.Text muted>
              Describa detalladamente la incidencia, incluyendo el impacto y las
              acciones necesarias
            </Form.Text>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="warning" type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : (incidenceData ? "Actualizar" : "Registrar")} Incidencia
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default IncidentModal;