import React from 'react'
import { Card, ProgressBar } from 'react-bootstrap';
import { BarChartSteps } from 'react-bootstrap-icons';
import '../statCard/statCard.css'

const ProgressByFeatureCard = ({ features }) => {
  // Función para calcular el progreso de cada funcionalidad
  const calculateFeatureProgress = (feature) => {
    if (!feature.tasks || feature.tasks.length === 0) {
      return { completed: 0, total: 0, inProgress: 0 };
    }

    const totalTasks = feature.tasks.length;
    const completedTasks = feature.tasks.filter(task => 
      task.progressState === "Completed" || task.taskState === "Completed"
    ).length;
    
    const inProgressTasks = feature.tasks.filter(task => 
      task.progressState === "In_Progress" || task.taskState === "In_Progress"
    ).length;

    return {
      completed: completedTasks,
      inProgress: inProgressTasks,
      total: totalTasks
    };
  };

  const FeatureProgress = ({ name, completed, inProgress, total, description }) => {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return (
      <div className="mb-3">
        {/* Encabezado de la barra */}
        <div className="d-flex justify-content-between align-items-start small mb-1">
          <div className="flex-grow-1">
            <span className="fw-bold d-block">{name}</span>
            
          </div>
          <div className="text-end ms-2">
            <span className="fw-bold">{percentage}%</span>
            <br />
            <small className="text-muted">
              {completed}C / {inProgress}EP / {total}T
            </small>
          </div>
        </div>
        
        {/* Barra de progreso con múltiples variantes */}
        <ProgressBar className="progress-bar-custom">
          <ProgressBar 
            variant="success" 
            now={(completed / total) * 100} 
            key={1}
            label={completed > 0 ? `${completed}` : ''}
          />
          <ProgressBar 
            variant="info" 
            now={(inProgress / total) * 100} 
            key={2}
            label={inProgress > 0 ? `${inProgress}` : ''}
          />
          <ProgressBar 
            variant="secondary" 
            now={((total - completed - inProgress) / total) * 100} 
            key={3}
          />
        </ProgressBar>
        
        {/* Leyenda de estados */}
        <div className="d-flex justify-content-between small text-muted mt-1">
          <span>Completadas: {completed}</span>
          <span>En Progreso: {inProgress}</span>
          <span>Pendientes: {total - completed - inProgress}</span>
        </div>
      </div>
    );
  };

  // Si no hay features, mostrar mensaje
  if (!features || features.length === 0) {
    return (
      <Card className="stat-card h-100 w-100 m-2">
        <Card.Body>
          <h6 className="card-title-muted mb-4">
            <BarChartSteps className="me-2" />
            Progreso por Funcionalidad
          </h6>
          <p className="text-muted text-center">No hay funcionalidades disponibles</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="stat-card h-100 w-100 m-2">
      <Card.Body>
        <h6 className="card-title-muted mb-4">
          <BarChartSteps className="me-2" />
          Progreso por Funcionalidad
        </h6>
        
        {/* Resumen general */}
        <div className="mb-3 p-2 bg-light rounded small">
          <strong>Resumen:</strong> {features.length} funcionalidades - 
          {features.reduce((sum, feature) => sum + (feature.tasks?.length || 0), 0)} tareas totales
        </div>
        
        {/* Mapeamos el array de 'features' para crear las barras */}
        {features.map((feature, index) => {
          const progress = calculateFeatureProgress(feature);
          
          return (
            <FeatureProgress 
              key={feature.id || index}
              name={feature.functionName || feature.nombre || "Sin nombre"}
              description={feature.functionDescription || feature.descripcion}
              completed={progress.completed}
              inProgress={progress.inProgress}
              total={progress.total}
            />
          );
        })}
      </Card.Body>
    </Card>
  );
}

export default ProgressByFeatureCard;