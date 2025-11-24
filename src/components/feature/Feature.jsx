import React from "react";
import { Container, Accordion } from "react-bootstrap";
import FeatureAccordion from "../featureAccordion/FeatureAccordion";
import "./features.css";

const Feature = ({ project, onTaskAdded }) => {
  
  // Verificamos si hay proyecto y funciones
  const functionsList = project?.functions || [];

  return (
    <Container fluid className="pt-4">
      {/* Si no hay funciones, mostramos un mensaje opcional o nada */}
      {functionsList.length === 0 && (
        <div className="text-center text-muted p-3">
          No hay funcionalidades registradas en este proyecto.
        </div>
      )}

      <Accordion defaultActiveKey="0" alwaysOpen>
        {functionsList.map((func, index) => {
          
          // Preparamos el objeto para FeatureAccordion usando los DATOS REALES.
          // Solo adaptamos los nombres de las claves para que coincidan 
          // con lo que espera tu FeatureAccordion ({ nombre, descripcion, tareas, id }).
          const featureData = {
            id: func.idFunction,          // ID Real de la base de datos
            nombre: func.functionName,    // Nombre real
            descripcion: func.functionDescription,
            tareas: func.tasks || [],     // Pasamos el array de tareas CRUDO (sin modificar estados)
            incidencias: func.incidencesList || []
          };
          return (
            <FeatureAccordion
              key={func.idFunction || index} // Usamos el ID real como key
              eventKey={index.toString()}
              feature={featureData}
              onTaskAdded={onTaskAdded}
            />
          );
        })}
      </Accordion>
    </Container>
  );
};

export default Feature;
