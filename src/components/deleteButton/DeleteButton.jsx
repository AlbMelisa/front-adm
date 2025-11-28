import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DeleteButton({ idProject, projectName, onDelete }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Obtener el token del localStorage o sessionStorage
  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Headers con autorización
  const getAuthHeaders = () => {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const handleConfirmarBaja = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        alert("No se encontró token de autenticación");
        return;
      }

      const response = await fetch(
        `http://localhost:5111/api/Projects/deleteProject/${idProject}`,
        {
          method: "PATCH",
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Token expirado o inválido");
        }
        if (response.status === 404) {
          throw new Error("Proyecto no encontrado");
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Avisamos al componente padre que el proyecto fue eliminado
      onDelete(idProject);

    } catch (error) {
      console.error("Error eliminando proyecto:", error);
      alert(`Error al eliminar el proyecto: ${error.message}`);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <>
      <div onClick={handleShow} style={{ cursor: 'pointer' }}>
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
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmarBaja}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Eliminando...
              </>
            ) : (
              'Sí, eliminar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteButton;