import React, { useState } from 'react'
import { Modal, Button, Form, Card, Badge } from "react-bootstrap";

const ModalProyect = ({ show, handleClose }) => {
    const [funcionalidades, setFuncionalidades] = useState([
    {
      id: 1,
      nombre: "Migración de Base de Datos",
      descripcion:
        "Migrar todas las bases de datos a AWS RDS con replicación",
      estado: "Completada",
    },
    {
      id: 2,
      nombre: "Configuración de Servidores",
      descripcion:
        "Configurar instancias EC2 con balanceo de carga",
      estado: "En Progreso",
    },
  ]);

  const [showNueva, setShowNueva] = useState(false);
  const [nuevaFunc, setNuevaFunc] = useState({ nombre: "", descripcion: "" });

  const agregarFuncionalidad = () => {
    if (!nuevaFunc.nombre.trim()) return;
    setFuncionalidades([
      ...funcionalidades,
      {
        id: Date.now(),
        nombre: nuevaFunc.nombre,
        descripcion: nuevaFunc.descripcion,
        estado: "Pendiente",
      },
    ]);
    setNuevaFunc({ nombre: "", descripcion: "" });
    setShowNueva(false);
  };

  const borrarFuncionalidad = (id) => {
    setFuncionalidades(funcionalidades.filter((f) => f.id !== id));
  };
    // 🔵 NUEVO: Estado para edición
  const [editandoId, setEditandoId] = useState(null);
  const [formEdit, setFormEdit] = useState({ nombre: "", descripcion: "" });

  // 🔵 NUEVO: activar edición
  const activarEdicion = (f) => {
    setEditandoId(f.id);
    setFormEdit({
      nombre: f.nombre,
      descripcion: f.descripcion,
    });
  };

  // 🔵 NUEVO: guardar cambios
  const guardarEdicion = () => {
    setFuncionalidades((prev) =>
      prev.map((f) =>
        f.id === editandoId ? { ...f, ...formEdit } : f
      )
    );
    setEditandoId(null);
  };

  return (
        <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Modificar Proyecto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text-muted mb-4">
          Actualiza las funcionalidades y presupuesto del proyecto
        </p>

        {/* Información del Proyecto */}
        <div className="p-3 mb-4 bg-light">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Nombre:</strong> Migración a la Nube V3</p>
              <p><strong>Cliente:</strong> 501</p>
              <p><strong>Fecha Inicio:</strong> 2024-09-01</p>
            </div>
            <div className="col-md-6">
              <p><strong>ID Proyecto:</strong> 1</p>
              <p><strong>Estado:</strong> En Planificación</p>
              <p><strong>ID Equipo:</strong> 101</p>
            </div>
          </div>
        </div>

        {/* Presupuesto */}
        <Form.Group className="mb-4">
          <Form.Label>Presupuesto del Proyecto</Form.Label>
          <Form.Control type="number" placeholder="$150000" />
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

                {editandoId === f.id ? (
                  <>
                    {/* 🔵 MODO EDICIÓN */}
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
                ) : (
                  <>
                    {/* 🔵 MODO VISUALIZACIÓN */}
                    <h6 className="mb-1">{f.nombre}</h6>
                    <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>
                      {f.descripcion}
                    </p>
                    {f.estado === "Completada" ? (
                      <Badge bg="success">Completada</Badge>
                    ) : f.estado === "En Progreso" ? (
                      <Badge bg="primary">En Progreso</Badge>
                    ) : (
                      <Badge bg="secondary">Pendiente</Badge>
                    )}
                  </>
                )}
              </div>

              <div className="d-flex flex-column gap-2">

                {editandoId === f.id ? (
                  <Button variant="outline-success" size="sm" onClick={guardarEdicion}>
                    💾
                  </Button>
                ) : (
                  <Button variant="outline-dark" size="sm" onClick={() => activarEdicion(f)}>
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
              </div>
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
        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        <Button variant="dark">Guardar Cambios</Button>
      </Modal.Footer>
    </Modal>
  );

  
}

export default ModalProyect