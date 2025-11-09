import React from 'react'
import { Card, ProgressBar } from 'react-bootstrap';
import './progressCard.css'
import '../statCard/statCard.css'

const ProgressCard = ({ title, icon, completed, total, unit = 'tareas' }) => {
  // 1. Calcular el porcentaje, asegurándonos de no dividir por cero.
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // 2. Formatear los textos que se mostrarán.
  const valueText = `${percentage}%`;
  const descriptionText = `${completed} de ${total} ${unit} completadas`;

  return (
    <Card className="stat-card h-90 w-100 m-1">
      <Card.Body>
        {/* Fila superior: Título e Ícono */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title-muted">{title}</h6>
          {icon && React.cloneElement(icon, { 
            size: 16, 
            className: 'text-muted' 
          })}
        </div>
        
        {/* Valor (67%) */}
        <h3 className="display-7 fw-bold">{valueText}</h3>
        
        {/* Barra de Progreso */}
        <ProgressBar 
          now={percentage} 
          variant="dark" 
          className="mb-2 progress-bar-custom"
        />
        
        {/* Descripción (2 de 3 tareas...) */}
        <small className="text-muted">{descriptionText}</small>
      </Card.Body>
    </Card>
  )
}

export default ProgressCard