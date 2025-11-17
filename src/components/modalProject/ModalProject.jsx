import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Card, Badge } from "react-bootstrap";

const ModalProject = ({ show, handleClose, project }) => {
  // const [budget, setBudget] = useState(0);
  // const [funcionalidades, setFuncionalidades] = useState([]);
  const [budget, setBudget] = useState(0);
  const [description, setDescription] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [funcionalidades, setFuncionalidades] = useState([]);
  const [changeReason, setChangeReason] = useState("");
  const [nuevasFunciones, setNuevasFunciones] = useState([]);
  const [showNueva, setShowNueva] = useState(false);
  const [nuevaFunc, setNuevaFunc] = useState({ nombre: "", descripcion: "" });


 useEffect(() => {
    if (project) {
      setBudget(project.budgetProject || 0);
      setDescription(project.descriptionProject || "");
      setDateEnd(project.dateEnd?.slice(0, 10) || "");
    }
  }, [project]);

  const agregarFuncionalidad = () => {
    if (!nuevaFunc.nombre.trim()) return;

    setNuevasFunciones([
      ...nuevasFunciones,
      {
        functionName: nuevaFunc.nombre,
        functionDescription: nuevaFunc.descripcion,
      },
    ]);

    setNuevaFunc({ nombre: "", descripcion: "" });
    setShowNueva(false);
  };

  const handleGuardarCambios = async () => {
    const payload = {
      idProject: project.idProject,
      newDescriptionProject: description,
      newBudgetProject: Number(budget),
      dateEnd: dateEnd,
      changeReason: changeReason,
      newFunctions: nuevasFunciones,
    };

    console.log("PATCH /projects =>", payload);

    await fetch(`http://localhost:3001/projects/${project.idProject}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Modificar Proyecto</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        {/* Información del Proyecto */}
        <div className="p-3 mb-4 bg-light rounded">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Nombre:</strong> {project?.nameProject}</p>
              <p><strong>Cliente:</strong> {project?.clientName}</p>
              <p><strong>Fecha Inicio:</strong> {project?.dataInitial?.slice(0,10)}</p>
            </div>
            <div className="col-md-6">
              <p><strong>ID Proyecto:</strong> {project?.idProject}</p>
              <p><strong>ID Equipo:</strong> {project?.teamNumber}</p>
            </div>
          </div>
        </div>
        <Form.Group className="mb-4">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            value={description}
            onChange={(e) => setBudget(e.target.value)}
          />
        </Form.Group>
        {/* Presupuesto */}
        <Form.Group className="mb-4">
          <Form.Label>Presupuesto del Proyecto</Form.Label>
          <Form.Control
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </Form.Group>

        {/* Funcionalidades */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5>Funcionalidades del Proyecto</h5>
          <Button variant="outline-dark" size="sm" onClick={() => setShowNueva(true)}>
            + Agregar Nueva
          </Button>
        </div>

        {funcionalidades.map((f) => (
          <Card key={f.id} className="p-3 mb-3 shadow-sm w-100">
            <div className="d-flex justify-content-between">
              <div className="w-75">
                <h6 className="mb-1">{f.functionName}</h6>
                <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>
                  {f.functionDescription}
                </p>

                {/* {editandoId === f.id ? (
                  <>
                    <Form.Control
                      className="mb-2"
                      value={formEdit.nombre}
                      onChange={(e) =>
                        setFormEdit({ ...formEdit, nombre: e.target.value })
                      }
                    />

                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={formEdit.descripcion}
                      onChange={(e) =>
                        setFormEdit({ ...formEdit, descripcion: e.target.value })
                      }
                    />
                  </>
                ) : ( */}
                  <>

                    
                  </>
                {/* )} */}
              </div>

              {/* <div className="d-flex flex-column gap-2">
                {editandoId === f.id ? (
                  <Button variant="outline-success" size="sm" onClick={guardarEdicion}>
                    💾
                  </Button>
                ) : (
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() => activarEdicion(f)}
                  >
                    ✏️
                  </Button>
                )}

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => borrarFuncionalidad(f.id)}
                >
                  🗑️
                </Button>
              </div> */}
            </div>
          </Card>
        ))}

        {/* Modal Nueva Funcionalidad */}
        {showNueva && (
          <Card className="p-3 mt-3 shadow-sm w-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Nueva Funcionalidad</h6>
              <Button size="sm" variant="outline-dark" onClick={() => setShowNueva(false)}>
                ✕
              </Button>
            </div>

            <Form.Control
              className="mb-2"
              placeholder="Nombre de la funcionalidad"
              value={nuevaFunc.nombre}
              onChange={(e) =>
                setNuevaFunc({ ...nuevaFunc, nombre: e.target.value })
              }
            />

            <Form.Control
              as="textarea"
              rows={3}
              className="mb-3"
              placeholder="Descripción detallada"
              value={nuevaFunc.descripcion}
              onChange={(e) =>
                setNuevaFunc({ ...nuevaFunc, descripcion: e.target.value })
              }
            />

            <Button variant="dark" onClick={agregarFuncionalidad}>
              Guardar Funcionalidad
            </Button>
          </Card>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>

        <Button variant="dark" onClick={handleGuardarCambios}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalProject;
