import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import { BarChartSteps } from 'react-bootstrap-icons';
import '../statCard/statCard.css';
import './ProgressByFeatureCard.css';

const ProgressByFeatureCard = ({ features, normalizeTaskState }) => {
  
  // Función para calcular el progreso usando la lógica centralizada
  const calculateFeatureProgress = (feature) => {
    if (!feature.tasks || feature.tasks.length === 0) {
      return { completed: 0, total: 0, development: 0, testing: 0 };
    }

    const totalTasks = feature.tasks.length;

    // Usamos normalizeTaskState para clasificar correctamente
    const completedTasks = feature.tasks.filter(task => 
      normalizeTaskState(task) === "Completed"
    ).length;
    
    const developmentTasks = feature.tasks.filter(task => 
      normalizeTaskState(task) === "Development"
    ).length;

    const testingTasks = feature.tasks.filter(task => 
      normalizeTaskState(task) === "Testing"
    ).length;

    return {
      completed: completedTasks,
      development: developmentTasks,
      testing: testingTasks,
      total: totalTasks
    };
  };

  // Componente interno para mostrar el progreso de cada feature
  const FeatureProgressItem = ({ feature, progress }) => {
    const { completed, development, testing, total } = progress;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Calculamos pendientes restando todo lo demás
    const pending = total - completed - development - testing;

    // Usamos functionName en lugar de nameFunction, según la estructura del JSON
    const featureName = feature.functionName || feature.nombre || "Sin nombre";

    return (
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-start small mb-1">
          <div className="flex-grow-1">
            <span className="fw-bold d-block">{featureName}</span>
            {feature.functionDescription && (
              <small className="text-muted d-block mt-1" style={{fontSize: "0.7rem"}}>
                {feature.functionDescription}
              </small>
            )}
          </div>
          <div className="text-end ms-2">
            <span className="fw-bold">{percentage}% Compl.</span>
            <br />
            {/* Resumen numérico rápido */}
            <small className="text-muted" style={{fontSize: "0.7rem"}}>
              {completed} OK / {testing} Test / {development} Dev
            </small>
          </div>
        </div>
        
        {/* Barra de progreso APILADA (Stacked) */}
        <ProgressBar className="progress-bar-custom" style={{ height: "12px" }}>
          
          {/* 1. Completadas (Verde) */}
          <ProgressBar 
            className="completed-bar"
            variant="success" 
            now={(completed / total) * 100} 
            key={1}
            title={`${completed} Completadas`}
          />

          {/* 2. Testing (Amarillo/Naranja) */}
          <ProgressBar 
            className="pending-bar"
            variant="warning" 
            now={(testing / total) * 100} 
            key={2}
            title={`${testing} en Testing`}
          />

          {/* 3. Desarrollo (Azul) */}
          <ProgressBar 
            className="inprogress-bar"
            variant="primary" 
            now={(development / total) * 100} 
            key={3}
            title={`${development} en Desarrollo`}
          />

          {/* 4. Pendientes (Gris/Secondary) */}
          {/* <ProgressBar 
            className="inprogress-bar"
            variant="secondary" 
            now={(pending / total) * 100} 
            key={4}
            style={{ opacity: 0.3 }}
            title={`${pending} Pendientes`}
          /> */}
        </ProgressBar>
        
        {/* Leyenda de estados */}
        <div className="d-flex justify-content-start flex-wrap small text-muted mt-1 gap-3" style={{ fontSize: "0.75rem" }}>
          <span className="text-success">● Listo: {completed}</span>
          <span className="text-warning">● Test: {testing}</span>
          <span className="text-primary">● Dev: {development}</span>
          {/* <span className="text-secondary">○ Pend: {pending}</span> */}
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
        <div className="mb-3 p-2 bg-light rounded small text-center">
          Total de tareas: <strong>{features.reduce((sum, feature) => sum + (feature.tasks?.length || 0), 0)}</strong>
        </div>
        
        <div style={{ maxHeight: "300px", overflowY: "auto", paddingRight: "5px" }}>
          {features.map((feature, index) => {
            const progress = calculateFeatureProgress(feature);
            
            return (
              <FeatureProgressItem 
                key={feature.idFunction || feature.id || index}
                feature={feature}
                progress={progress}
              />
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProgressByFeatureCard;