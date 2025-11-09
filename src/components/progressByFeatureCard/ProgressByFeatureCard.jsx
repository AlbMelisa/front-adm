import React from 'react'
import { Card, ProgressBar } from 'react-bootstrap';
import { BarChartSteps } from 'react-bootstrap-icons';
import '../statCard/statCard.css'

const ProgressByFeatureCard = ({features}) => {
  const FeatureProgress = ({ name, completed, total }) => {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return (
      <div className="mb-3">
        {/* Encabezado de la barra */}
        <div className="d-flex justify-content-between small mb-1">
          <span className="fw-bold">{name}</span>
          <span className="text-muted">{`${completed}/${total}`}</span>
        </div>
        {/* Barra de progreso */}
        <ProgressBar 
          now={percentage} 
          variant="dark"
          className="progress-bar-custom" // Reutiliza el estilo de antes
        />
      </div>
    );
  };

  return (
    <Card className="stat-card h-100 w-100 m-2">
      <Card.Body>
        <h6 className="card-title-muted mb-4">
          <BarChartSteps className="me-2" />
          Progreso por Funcionalidad
        </h6>
        
        {/* Mapeamos el array de 'features' para crear las barras */}
        {features && features.map((feature, index) => (
          <FeatureProgress 
            key={index} // Usar un ID único si lo tienes (ej. feature.id)
            name={feature.name}
            completed={feature.completed}
            total={feature.total}
          />
        ))}
      </Card.Body>
    </Card>
  )
}

export default ProgressByFeatureCard