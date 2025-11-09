import React from 'react';
import { Card } from 'react-bootstrap';
import './statCard.css'
// Importa tu archivo CSS para este componente
import './StatCard.css';

const StatCard = ({ title, value, description, icon, variant }) => {
  const iconClass = variant ? `text-${variant}` : 'text-muted';
  return (
    <Card className="stat-card h-90 w-100 m-2">
      <Card.Body>
        {/* Fila superior: Título e Ícono */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title-muted">{title}</h6>
          
          {/* Clonamos el ícono pasado como prop para añadirle 
            el tamaño y la clase de color dinámicamente.
          */}
          {icon && React.cloneElement(icon, { 
            size: 24, 
            className: iconClass 
          })}
        </div>
        
        {/* Valor principal */}
        <h3 className="display-6 fw-bold">{value}</h3>
        
        {/* Descripción inferior */}
        <small className="text-muted">{description}</small>
      </Card.Body>
    </Card>
  )
}

export default StatCard