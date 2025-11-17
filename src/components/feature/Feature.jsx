import React, { useState, useEffect } from "react";
import {
  Container,
  Accordion,
} from "react-bootstrap";
import FeatureAccordion from "../featureAccordion/FeatureAccordion";
import "./features.css";

const Feature = ({ project, onTaskAdded }) => {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    if (!project || !project.functions) return;
    console.log("Llega a Feature:", project);
    
    // Convertir datos de la API a tu estructura
    const mappedFeatures = project.functions.map((func, index) => ({
      id: index + 1,
      nombre: func.functionName,
      descripcion: func.functionDescription,
      
      // ⭐ MOSTRAR TODAS LAS TAREAS
      tareas: func.tasks?.map((t) => ({
        id: t.idTask,
        nombre: t.taskName,
        descripcion: t.taskDescription,
        // ⭐ Mapear estados para que coincidan con getStatusBadge
        estado: getEstadoTarea(t),
        // Propiedades adicionales que podrías necesitar
        prioridad: t.taskPriority,
        fechaFin: t.dateEnd,
        fechaInicio: t.dateInitial,
      })) || [],

      incidencias: [], // Mantenemos vacío como en tu código original
    }));
    
    console.log("Features mapeadas:", mappedFeatures);
    setFeatures(mappedFeatures);
  }, [project]);

  // ⭐ Función para determinar el estado de la tarea
  const getEstadoTarea = (tarea) => {
    if (tarea.progressState === "Completed" || tarea.taskState === "Completed") {
      return "Completada";
    } else if (tarea.progressState === "In_Progress" || tarea.taskState === "In_Progress") {
      return "En Progreso";
    } else if (tarea.progressState === "Cancelled" || tarea.taskState === "Cancelled") {
      return "Cancelada";
    } else {
      return "Pendiente";
    }
  };

  return (
    <Container fluid className="dashboard-container pt-4">
      <Accordion defaultActiveKey="0" alwaysOpen>
        {features.map((feature, index) => (
          <FeatureAccordion
            key={feature.id}
            eventKey={index.toString()}
            feature={feature}
            onTaskAdded={onTaskAdded}
          />
        ))}
      </Accordion>
    </Container>
  );
};

export default Feature;

