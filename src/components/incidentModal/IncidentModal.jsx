import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsExclamationCircleFill } from "react-icons/bs";

const mockProyectos = [
  { id: 1, nombre: "Proyecto SmartGym" },
  { id: 2, nombre: "Migración a la Nube V3" },
  { id: 3, nombre: "Sistema de Pacientes" },
];

const tiposDeIncidencia = [
  "Humano",
  "Tecnológico",
  "Material",
  "Externo",
];


const IncidentModal = ({ show, onHide, proyectos = mockProyectos }) => {
  const [projectId, setProjectId] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");

  const handleClose = () => {
    setProjectId("");
    setIncidentType("");
    setDescription("");
    onHide(); // Llama a la función del padre para cerrar
  };

  /**
   * Maneja el envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // 1. Construir el payload para la API
    const payload = {
      idProyecto: projectId, // Ojo: puede ser 'Number(projectId)' si tu API espera un número
      tipo: incidentType,
      descripcion: description,
    };

    console.log("Enviando Incidencia a la API:", payload);

    try {
      // --- Lógica de API (POST) ---
      // const response = await fetch("URL_DE_TU_API/incidencias", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      // if (!response.ok) throw new Error("Error al registrar la incidencia");
      // -----------------------------
      
      handleClose(); // Cierra el modal si todo salió bien
    } catch (error) {
      console.error("Error al registrar incidencia:", error);
      // Aquí podrías mostrar una alerta de error
    }
  };

  return (
    // 'onHide' se llama cuando se hace clic en la 'X' o fuera del modal
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {/* Ícono de advertencia (color 'warning' es naranja/amarillo) */}
          <BsExclamationCircleFill className="text-warning me-2" />
          Registrar Incidencia
        </Modal.Title>
      </Modal.Header>

      {/* Usamos un <Form> para manejar el 'onSubmit' */}
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
         
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
          <Button variant="light" onClick={handleClose}>
            Cancelar
          </Button>
          {/* El variant 'warning' es el más cercano al naranja */}
          <Button variant="warning" type="submit">
            Registrar Incidencia
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default IncidentModal;