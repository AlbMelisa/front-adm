import React, { useState } from 'react';
import {
  Accordion,
  Button,
  Badge,
  Card,
  Row,
  Col
} from 'react-bootstrap';
import { BsPencil, BsTrash, BsPlusLg } from 'react-icons/bs';
import IncidentModal from '../incidentModal/IncidentModal';
import '../incidentModal/incidentModal.css'

const getBadgeBg = (tipo) => {
  switch (tipo) {
    case "Humano":
      return "primary";
    case "Tecnológico":
      return "purple";
    case "Material":
      return "warning";
    case "Recursos":
      return "info";
    default:
      return "secondary";
  }
};

const getStatusBadge = (estado) => {
  switch (estado) {
    case "Completada":
      return "success";
    case "En Progreso":
      return "info";
    case "Pendiente":
      return "warning";
    case "Cancelada":
      return "danger";
    default:
      return "secondary";
  }
};

const Incidence = ({ incidences, onIncidenceAdded, projectId }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedIncidence, setSelectedIncidence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Función para manejar la agregar incidencia
  const handleAddIncidence = () => {
    setSelectedIncidence(null);
    setShowModal(true);
  };

  // Función para manejar la edición de incidencias
  const handleEditIncidence = (inc) => {
    setSelectedIncidence(inc);
    setShowModal(true);
  };

  // Función para manejar la eliminación de incidencias
  const handleDeleteIncidence = async (incidenceId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta incidencia?")) {
      try {
        const response = await fetch(`http://localhost:3001/incidences/${incidenceId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la incidencia');
        }

        if (onIncidenceAdded) {
          onIncidenceAdded();
        }

        alert('Incidencia eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar incidencia:', error);
        alert('Error al eliminar la incidencia: ' + error.message);
      }
    }
  };

  // ⭐ FUNCIÓN CORREGIDA PARA EL POST CON SOLO 3 CAMPOS
  const handleSubmitIncidence = async (incidenceData) => {
    setIsLoading(true);
    try {
      // ⭐ PAYLOAD EXACTO CON SOLO LOS 3 CAMPOS REQUERIDOS
      const incidencePayload = {
        idProyect: projectId, // Usar el projectId que viene como prop
        typeIncidence: incidenceData.tipo,
        descriptionIncidence: incidenceData.descripcion
      };

      console.log("Enviando incidencia:", incidencePayload);

      // ⭐ POST A LA RUTA ESPECIFICADA
      const response = await fetch('http://localhost:3001/Incidence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incidencePayload)
      });

      if (!response.ok) {
        throw new Error('Error al crear la incidencia');
      }

      const result = await response.json();
      console.log("Incidencia creada exitosamente:", result);

      setShowModal(false);
      setSelectedIncidence(null);

      if (onIncidenceAdded) {
        onIncidenceAdded();
      }

      alert('Incidencia creada exitosamente');

    } catch (error) {
      console.error('Error al crear incidencia:', error);
      alert('Error al crear la incidencia: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Accordion className="pt-3 m-2" defaultActiveKey={['0']}>
      <Accordion.Item eventKey="0">
        <Accordion.Header className='incidencias-header'>Incidencias</Accordion.Header>
        <Accordion.Body>
          <div className="section-header mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                Incidencias Asignadas
                <Badge bg="light" text="dark" className="ms-2">
                  {incidences?.length || 0}
                </Badge>
              </h5>
              <Button
                className="btn-agregar-incidencia"
                variant="outline-primary"
                size="sm"
                onClick={handleAddIncidence}
                disabled={isLoading}
              >
                <BsPlusLg className="me-1" /> Agregar Incidencia
              </Button>
            </div>
          </div>

          <Row className="mb-4">
            {incidences && incidences.length > 0 ? (
              incidences.map((inc) => (
                <Col md={6} key={inc.id || inc.idIncidence} className="mb-3">
                  <Card className="item-card w-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <Card.Title className="h6">
                            {inc.typeIncidence || inc.tipo || "Tipo no especificado"}{" "}
                            <Badge
                              className={
                                inc.typeIncidence === "Tecnológico" || inc.tipo === "Tecnológico"
                                  ? "badge-tecnologico"
                                  : ""
                              }
                              bg={getBadgeBg(inc.typeIncidence || inc.tipo)}
                            >
                              {inc.typeIncidence || inc.tipo}
                            </Badge>
                            {inc.incidenceState || inc.estado ? (
                              <Badge 
                                bg={getStatusBadge(inc.incidenceState || inc.estado)} 
                                className="ms-1"
                              >
                                {inc.incidenceState || inc.estado}
                              </Badge>
                            ) : null}
                          </Card.Title>
                          <Card.Text className="mb-0">
                            {inc.descriptionIncidence || inc.descripcion || "Sin descripción"}
                          </Card.Text>
                          {inc.reportDate && (
                            <small className="text-muted d-block mt-1">
                              Fecha: {new Date(inc.reportDate).toLocaleDateString()}
                            </small>
                          )}
                        </div>
                        <div className="d-flex ms-2">
                          <Button 
                            
                            variant="outline-secondary" 
                            size="sm" 
                            className="me-1"
                            onClick={() => handleEditIncidence(inc)}
                            disabled={isLoading}
                          >
                            <BsPencil />
                          </Button>
                          <Button 
                            
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeleteIncidence(inc.id || inc.idIncidence)}
                            disabled={isLoading}
                          >
                            <BsTrash />
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <p className="text-muted text-center">No hay incidencias asignadas.</p>
              </Col>
            )}
          </Row>

          <IncidentModal
            show={showModal}
            onHide={() => {
              setShowModal(false);
              setSelectedIncidence(null);
            }}
            onSubmit={handleSubmitIncidence}
            incidenceData={selectedIncidence}
            isLoading={isLoading}
            projectId={projectId}
          />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default Incidence;