import Col from "react-bootstrap/Col";
import StatCard from "../../components/statCard/StatCard";
import {
  GraphUp,
  CheckCircleFill,
  ClockHistory,
  PauseCircle,
} from "react-bootstrap-icons";
import { Button, Container, Row } from "react-bootstrap";
import ProgressCard from "../../components/progressCard/ProgressCard";
import { useCallback, useEffect, useState } from "react";
import ResourceCard from "../../components/resourceCard/ResourceCard";
import ProgressByFeatureCard from "../../components/progressByFeatureCard/ProgressByFeatureCard";
import { useParams } from "react-router-dom";
import Feature from "../../components/feature/Feature";
import Incidence from "../../components/incidence/Incidence";

const Project = () => {
  const { idProyecto } = useParams();
  const [project, setProject] = useState(null);
  const [projectError, setProjectError] = useState(null);

    // Si necesitas usar el idProyecto en la URL
  const fetchProject = useCallback(async () => {
    try {
      // Si tu endpoint acepta el ID del proyecto
      const url = idProyecto 
        ? `http://localhost:3001/ProjectsgetById6/${idProyecto}`
        : `http://localhost:3001/ProjectsgetById6`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al obtener proyecto");

      const data = await res.json();
      console.log("Datos recibidos:", data);
      
      if (data && data.length > 0 && data[0].proyect) {
        setProject(data[0].proyect);
      } else {
        throw new Error("No se encontró el proyecto");
      }
    } catch (err) {
      setProjectError(err.message);
    }
  }, [idProyecto]); // Incluir idProyecto en dependencias si se usa

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  
  if (projectError) return <p>Error: {projectError}</p>;
  if (!project) return <p>Cargando proyecto...</p>;

  // ⭐ CORRECCIÓN: Verificar que project.functions existe
  const allTasks = project.functions
    ? project.functions.flatMap((f) => f.tasks || [])
    : [];

  const totalTasks = allTasks.length;

  const completedTasks = allTasks.filter(
    (t) => t.progressState === "Completed" || t.taskState === "Completed"
  ).length;

  const inProgressTasks = allTasks.filter(
    (t) => t.progressState === "In_Progress" || t.taskState === "In_Progress"
  ).length;

  const pendingTasks = totalTasks - completedTasks - inProgressTasks;

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="dashboard-title">
          Gestión de Funcionalidades - {project.nameProject}
        </h2>
      </div>

      {/* 👇 Tarjetas de estadística */}
      <Row>
        <Col>
          <ProgressCard
            title="Progreso General"
            icon={<GraphUp />}
            completed={completedTasks}
            total={totalTasks}
            unit="tareas"
          />
        </Col>

        <Col>
          <StatCard
            title="TAREAS COMPLETADAS"
            value={completedTasks}
            description="Tareas completadas"
            icon={<CheckCircleFill />}
            variant="success"
          />
        </Col>

        <Col>
          <StatCard
            title="EN PROGRESO"
            value={inProgressTasks}
            description="Tareas activas"
            icon={<ClockHistory />}
            variant="primary"
          />
        </Col>

        {/* <Col>
          <StatCard
            title="PENDIENTES"
            value={pendingTasks}
            description="Tareas por realizar"
            icon={<PauseCircle />}
            variant="muted"
          />
        </Col> */}
      </Row>

      {/* 👇 Tarjetas de recursos y progreso por funcionalidad */}
      <Row>
        <Col>
          <ResourceCard resources={project} />
        </Col>
        <Col>
          <ProgressByFeatureCard features={project.functions || []} />
        </Col>
      </Row>
          <Row>
            <Incidence 
            incidences={project?.incidencesList || []} 
            onIncidenceAdded={() => {
              fetchProject()
            }}
            projectId={project?.idProject}/>
          </Row>
      {/* 👇 Componente que muestra las funcionalidades + sus tareas */}
      <Row>
        <Col>
          <Feature
            project={project}
            onTaskAdded={() => {
              fetchProject()
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Project;
