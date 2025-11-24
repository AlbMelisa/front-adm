import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Card, Alert } from "react-bootstrap";

const ModalProject = ({ show, handleClose, project }) => {
  const [budget, setBudget] = useState(0);
  const [description, setDescription] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [changeReason, setChangeReason] = useState("");
  const [nuevasFunciones, setNuevasFunciones] = useState([]);
  const [showNueva, setShowNueva] = useState(false);
  const [nuevaFunc, setNuevaFunc] = useState({ nombre: "", descripcion: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (project) {
      setBudget(project.budgetProject || 0);
      setDescription(project.descriptionProject || "");
      // Formatear la fecha para el input type="date"
      const formattedDate = project.dateEnd && project.dateEnd !== "0001-01-01" 
        ? project.dateEnd.slice(0, 10) 
        : "";
      setDateEnd(formattedDate);
      setNuevasFunciones([]); // Resetear nuevas funciones al abrir el modal
      setChangeReason(""); // Resetear razón del cambio
      setError(""); // Limpiar errores
      setSuccess(""); // Limpiar mensajes de éxito
    }
  }, [project, show]);

  const agregarFuncionalidad = () => {
    if (!nuevaFunc.nombre.trim()) {
      setError("El nombre de la funcionalidad es requerido");
      return;
    }

    setNuevasFunciones([
      ...nuevasFunciones,
      {
        functionName: nuevaFunc.nombre,
        functionDescription: nuevaFunc.descripcion,
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

  const handleGuardarCambios = async () => {
    // Validaciones
    if (!changeReason.trim()) {
      setError("La razón del cambio es requerida");
      return;
    }

    if (!dateEnd) {
      setError("La fecha de finalización es requerida");
      return;
    }

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
        newDescriptionProject: description,
        newBudgetProject: Number(budget),
        dateEnd: dateEnd,
        changeReason: changeReason,
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
    setChangeReason("");
    handleClose(false);
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el proyecto..."
          />
        </Form.Group>

        {/* Presupuesto */}
        <Form.Group className="mb-3">
          <Form.Label>Presupuesto del Proyecto ($)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </Form.Group>

        {/* Fecha de Finalización */}
        <Form.Group className="mb-3">
          <Form.Label>Fecha de Finalización</Form.Label>
          <Form.Control
            type="date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
          />
        </Form.Group>

        {/* Razón del Cambio */}
        <Form.Group className="mb-3">
          <Form.Label>Razón del Cambio *</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={changeReason}
            onChange={(e) => setChangeReason(e.target.value)}
            placeholder="Explica por qué se realizan estos cambios..."
            required
          />
          <Form.Text className="text-muted">
            Este campo es obligatorio para realizar cualquier modificación.
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
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe la funcionalidad..."
                value={nuevaFunc.descripcion}
                onChange={(e) => setNuevaFunc({ ...nuevaFunc, descripcion: e.target.value })}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                onClick={agregarFuncionalidad}
                disabled={!nuevaFunc.nombre.trim()}
              >
                Guardar Funcionalidad
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  setShowNueva(false);
                  setNuevaFunc({ nombre: "", descripcion: "" });
                }}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={handleCloseModal}
          disabled={loading}
        >
          Cancelar
        </Button>

        <Button 
          variant="primary" 
          onClick={handleGuardarCambios}
          disabled={loading || !changeReason.trim() || !dateEnd}
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalProject;