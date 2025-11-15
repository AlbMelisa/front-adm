// FuncionalidadesDashboard.jsx
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Button,
  Accordion,
} from "react-bootstrap";
import { BsPencil, BsTrash, BsPlusLg } from "react-icons/bs";
import FeatureAccordion from "../featureAccordion/FeatureAccordion";
import "./features.css";
const initialFeatures = [
  {
    id: 1,
    nombre: "Sistema de Autenticacion",
    descripcion: "wiknrenme",
    tareas: [
      {
        id: 101,
        nombre: "Implementar login",
        descripcion: "enriemeimei",
        asignado: "Carlos López",
        estado: "Completada",
      },
      {
        id: 102,
        nombre: "Implementar ékcreimelmel",
        descripcion: "enriemeimei",
        asignado: "Juan Pérez",
        estado: "En Progreso",
      },
    ],
    incidencias: [
      {
        id: 201,
        nombre: "Computadora",
        tipo: "Tecnológico",
        cantidad: 1,
        necesidad: "Se necesita",
      },
      {
        id: 202,
        nombre: "Desarrollador Frontend",
        tipo: "Humano",
        cantidad: 3,
        necesidad: "Cantidad: 3",
      },
    ],
  },
  {
    id: 2,
    nombre: "Cargar Datos",
    descripcion: "eneriemeimei",
    tareas: [{ id: 103, nombre: "Definir API", estado: "Pendiente" }],
    incidencias: [
      { id: 203, nombre: "Servidor BD", tipo: "Tecnológico", cantidad: 1 },
    ],
  },
];

const Feature = () => {
  const [features, setFeatures] = useState(initialFeatures);
  const [showModal, setShowModal] = useState(false);

  // Calcula los totales para las tarjetas de resumen
  const totalTareas = features.reduce((acc, f) => acc + f.tareas.length, 0);
  const tareasCompletadas = features
    .flatMap((f) => f.tareas)
    .filter((t) => t.estado === "Completada").length;
  const tareasEnProgreso = features
    .flatMap((f) => f.tareas)
    .filter((t) => t.estado === "En Progreso").length;
  const tareasPendientes = totalTareas - tareasCompletadas - tareasEnProgreso;
  const progresoGeneral =
    totalTareas > 0 ? (tareasCompletadas / totalTareas) * 100 : 0;

  // Lógica para el modal

  return (
    <Container fluid className="dashboard-container pt-4 ">
      <Accordion defaultActiveKey="0" alwaysOpen>
        {features.map((feature, index) => (
          <FeatureAccordion
            key={feature.id}
            eventKey={index.toString()}
            feature={feature}
          />
        ))}
      </Accordion>

      {/* --- Modal --- */}
      {/* <AddFeatureModal
        show={showModal}
        onHide={handleCloseModal}
        onAdd={handleAddFeature}
      />  */}
    </Container>
  );
};

export default Feature;
