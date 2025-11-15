import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DeleteButton({ idProject, projectName, onDelete }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleConfirmarBaja = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/Projects/deleteProyect/${idProject}`,
        {
          method: "DELETE",
          // NO ES DELETE, TIENE QUE SER OTRO METODO
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el proyecto");
      }

      // Avisamos al componente padre que el proyecto fue eliminado
      onDelete(idProject);

    } catch (error) {
      console.error("Error eliminando proyecto:", error);
    } finally {
      handleClose();
    }
  };

  return (
    <>
      <div onClick={handleShow}>
        Eliminar
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar baja de proyecto</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          ¿Estás segura de que querés eliminar:
          <strong> {projectName}</strong>?
          <br />
          <span className="text-danger">Esta acción no se puede deshacer.</span>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmarBaja}>
            Sí, eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteButton;
