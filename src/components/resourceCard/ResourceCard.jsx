import React from 'react'
import './resourceCard.css'
import { Card, Row, Col } from 'react-bootstrap';
import { PersonBoundingBox } from 'react-bootstrap-icons';

const ResourceCard = ({resources}) => {
  return (
    <Card className="stat-card h-100 w-100 m-2">
      <Card.Body>
        {/* Título y Total General */}
        <Row className="align-items-start mb-4">
          <Col>
            <h6 className="card-title-muted">
              <PersonBoundingBox className="me-2" />
              Recursos Asignados
            </h6>
          </Col>
          <Col xs="auto">
            <h3 className="display-6 fw-bold">{resources.total}</h3>
          </Col>
        </Row>

        {/* Lista de Recursos */}
        <div className="resource-list">
          <div className="resource-item">
            <span className="dot dot-humanos"></span> Humanos
            <span className="ms-auto fw-bold">{resources.humanos}</span>
          </div>
          <div className="resource-item">
            <span className="dot dot-materiales"></span> Materiales
            <span className="ms-auto fw-bold">{resources.materiales}</span>
          </div>
          <div className="resource-item">
            <span className="dot dot-tecnologicos"></span> Tecnológicos
            <span className="ms-auto fw-bold">{resources.tecnologicos}</span>
          </div>
          <div className="resource-item">
            <span className="dot dot-financieros"></span> Financieros
            <span className="ms-auto fw-bold">{resources.financieros}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ResourceCard