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
import { useParams, useNavigate } from "react-router-dom";
import Feature from "../../components/feature/Feature";
import Incidence from "../../components/incidence/Incidence";

const Project = () => {
  const { idProject } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [projectError, setProjectError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validar token
  const verifyToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        isValid: false,
        message: "No hay token de autenticación. Por favor, inicia sesión.",
      };
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("token");
        return {
          isValid: false,
          message: "El token ha expirado. Por favor, inicia sesión nuevamente.",
        };
      }

      return { isValid: true, token };
    } catch {
      localStorage.removeItem("token");
      return {
        isValid: false,
        message: "Token inválido. Por favor, inicia sesión nuevamente.",
      };
    }
  };

  const extractProjectData = (data) => {

    if (data.message && data.proyect) return data.proyect;
    if (data.ProjectsgetById && Array.isArray(data.ProjectsgetById)) {
      return data.ProjectsgetById[0].proyect || data.ProjectsgetById[0];
    }
    if (Array.isArray(data) && data.length > 0) {
      return data[0].proyect || data[0];
    }
    if (data.proyect) return data.proyect;
    if (data.project) return data.project;
    if (data.idProject) return data;

    for (const key in data) {
      if (Array.isArray(data[key]) && data[key].length > 0) {
        return data[key][0].proyect || data[key][0];
      }
    }

    return null;
  };

  // ⭐ FUNCIÓN CORREGIDA ⭐
  // ⭐ FUNCIÓN CORREGIDA: Separando los estados ⭐
  const normalizeTaskState = (task) => {
    const raw = task.taskState || "Pending";

    switch (raw.toLowerCase()) {
      case "completed":
        return "Completed";
      case "development":
        return "Development"; // Ya no retorna "In_Progress"
      case "testing":
        return "Testing"; // Ya no retorna "In_Progress"
      default:
        return "Pending";
    }
  };

  const calculateTaskStatistics = (projectData) => {
    if (!projectData || !projectData.functions) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        developmentTasks: 0,
        testingTasks: 0,
        pendingTasks: 0,
      };
    }

    const allTasks = projectData.functions.flatMap((func) => func.tasks || []);
    const totalTasks = allTasks.length;

    // Contamos cada estado por separado
    const completedTasks = allTasks.filter(
      (task) => normalizeTaskState(task) === "Completed"
    ).length;

    const developmentTasks = allTasks.filter(
      (task) => normalizeTaskState(task) === "Development"
    ).length;

    const testingTasks = allTasks.filter(
      (task) => normalizeTaskState(task) === "Testing"
    ).length;

    // El resto son pendientes
    const pendingTasks =
      totalTasks - completedTasks - developmentTasks - testingTasks;

    return {
      totalTasks,
      completedTasks,
      developmentTasks,
      testingTasks,
      pendingTasks,
    };
  };

  const fetchProject = useCallback(async () => {
    if (!idProject || idProject === "undefined" || idProject === "null") {
      setProjectError("No se proporcionó un ID de proyecto válido");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setProjectError(null);

      const tokenValidation = verifyToken();
      if (!tokenValidation.isValid) throw new Error(tokenValidation.message);

      const url = `http://localhost:5111/api/Projects/getById/${idProject}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenValidation.token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        throw new Error(
          "Sesión expirada. Por favor, inicia sesión nuevamente."
        );
      }

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      const projectData = extractProjectData(data);
      if (!projectData) {
        throw new Error(
          "El servidor respondió pero no se encontró estructura válida de proyecto"
        );
      }

      setProject(projectData);
    } catch (err) {
      setProjectError(err.message);
      if (err.message.includes("sesión") || err.message.includes("token")) {
        setTimeout(() => navigate("/login"), 3000);
      }
    } finally {
      setLoading(false);
    }
  }, [idProject, navigate]);

  useEffect(() => {
    if (idProject) fetchProject();
  }, [fetchProject, idProject]);

  const taskStats = project
    ? calculateTaskStatistics(project)
    : {
        totalTasks: 0,
        completedTasks: 0,
        developmentTasks: 0,
        testingTasks: 0,
        pendingTasks: 0,
      };

  if (!idProject) {
    return (
      <Container fluid className="p-4">
        <div className="alert alert-danger">
          <h4>Error: ID no encontrado</h4>
          <p>Ejemplo: /project/6</p>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container fluid className="p-4 text-center">
        <div className="spinner-border"></div>
        <p>Cargando proyecto ID: {idProject}</p>
      </Container>
    );
  }

  if (projectError) {
    const isAuthError =
      projectError.includes("sesión") || projectError.includes("token");
    return (
      <Container fluid className="p-4">
        <div
          className={`alert ${isAuthError ? "alert-warning" : "alert-danger"}`}
        >
          <h4>{isAuthError ? "Error de autenticación" : "Error al cargar"}</h4>
          <p>{projectError}</p>
        </div>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container fluid className="p-4">
        <div className="alert alert-warning">
          <h4>Proyecto no encontrado</h4>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Funcionalidades - {project.nameProject}</h2>
        <div>
          <small>ID: {idProject}</small>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={fetchProject}
            className="ms-2"
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <Row className="mb-4">
        {/* ... dentro del return ... */}

        {/* Card de Completadas (Sin cambios) */}
        <Col>
          <StatCard
            title="COMPLETADAS"
            value={taskStats.completedTasks}
            description="Tareas terminadas"
            icon={<CheckCircleFill />}
            variant="success"
          />
        </Col>

        {/* Card de Desarrollo (Antes era 'En Progreso') */}
        <Col>
          <StatCard
            title="EN DESARROLLO"
            value={taskStats.developmentTasks}
            description="En codificación"
            icon={<ClockHistory />} // O puedes usar otro icono como <CodeSquare />
            variant="primary"
          />
        </Col>

        {/* NUEVA Card de Testing */}
        <Col>
          <StatCard
            title="EN TESTING"
            value={taskStats.testingTasks}
            description="En pruebas QA"
            icon={<PauseCircle />} // O un icono como <Bug /> si lo importas
            variant="warning" // Color amarillo/naranja usualmente para testing
          />
        </Col>
      </Row>

      {/* Recursos y progreso por funcionalidad */}
      <Row className="mb-4">
        {/* <Col xs={12} lg={6}>
          <ResourceCard resources={project} />
        </Col> */}
        <Col >
          <ProgressByFeatureCard
            features={project.functions || []}
            normalizeTaskState={normalizeTaskState}
          />
        </Col>
      </Row>

      {/* Incidencias */}
      <Row className="mb-4">
        <Col xs={12}>
          <Incidence
            incidences={project.incidencesList || []}
            onIncidenceAdded={fetchProject}
            projectId={project.idProject || idProject}
          />
        </Col>
      </Row>

      {/* Funcionalidades */}
      <Row>
        <Col xs={12}>
          <Feature
            project={project}
            onTaskAdded={fetchProject}
            normalizeTaskState={normalizeTaskState}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Project;
