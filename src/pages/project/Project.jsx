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
  const { idProject } = useParams();

  // DEBUG importante
  console.log("🔍 useParams():", useParams());
  console.log("🔍 idProject:", idProject);
  console.log("🔍 URL completa:", window.location.href);

  const [project, setProject] = useState(null);
  const [projectError, setProjectError] = useState(null);
  const [loading, setLoading] = useState(true);

  const extractProjectData = (data) => {
    console.log("🔍 Analizando estructura de datos:", data);
    
    // Caso 1: Estructura con "ProjectsgetById" (tu JSON original)
    if (data.ProjectsgetById && Array.isArray(data.ProjectsgetById)) {
      console.log("✅ Estructura encontrada: data.ProjectsgetById");
      if (data.ProjectsgetById.length > 0) {
        return data.ProjectsgetById[0].proyect || data.ProjectsgetById[0];
      }
    }
    
    // Caso 2: Array directo
    if (Array.isArray(data) && data.length > 0) {
      console.log("✅ Estructura encontrada: Array directo");
      return data[0].proyect || data[0];
    }
    
    // Caso 3: Objeto con propiedad "proyect"
    if (data.proyect) {
      console.log("✅ Estructura encontrada: data.proyect");
      return data.proyect;
    }
    
    // Caso 4: Objeto con propiedad "project" (inglés)
    if (data.project) {
      console.log("✅ Estructura encontrada: data.project");
      return data.project;
    }
    
    // Caso 5: El objeto ya es el proyecto (tiene idProject)
    if (data.idProject) {
      console.log("✅ Estructura encontrada: Objeto directo con idProject");
      return data;
    }
    
    // Caso 6: Buscar cualquier propiedad que contenga un array
    for (const key in data) {
      if (Array.isArray(data[key]) && data[key].length > 0) {
        console.log(`✅ Estructura encontrada: data.${key} (array)`);
        const firstItem = data[key][0];
        return firstItem.proyect || firstItem;
      }
    }
    
    console.log("❌ No se pudo identificar la estructura del proyecto");
    return null;
  };

  const fetchProject = useCallback(async () => {
    // Validación más estricta
    if (!idProject || idProject === "undefined" || idProject === "null") {
      console.log("❌ id es inválido:", idProject);
      setProjectError("No se proporcionó un ID de proyecto válido");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setProjectError(null);
      
      const url = `http://localhost:3001/ProjectsgetById/${idProject}`;
      console.log("🌐 Haciendo fetch a:", url);
      
      const res = await fetch(url);
      console.log("📡 Respuesta del servidor - Status:", res.status);
      console.log("📡 Respuesta OK:", res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Error response body:", errorText);
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("📦 Datos recibidos COMPLETOS:", data);
      console.log("🔍 Tipo de datos:", typeof data);
      console.log("🔍 ¿Es array?:", Array.isArray(data));
      
      if (data && typeof data === 'object') {
        console.log("🔍 Keys del objeto:", Object.keys(data));
      }

      // Extraer el proyecto de cualquier estructura posible
      const projectData = extractProjectData(data);
      
      if (projectData) {
        console.log("✅ Proyecto extraído:", projectData);
        console.log("✅ Nombre del proyecto:", projectData.nameProject);
        console.log("✅ ID del proyecto:", projectData.idProject);
        setProject(projectData);
      } else {
        console.error("❌ No se pudo extraer el proyecto de la estructura:");
        console.error("Estructura completa:", JSON.stringify(data, null, 2));
        throw new Error("El servidor respondió pero no se pudo encontrar la estructura del proyecto");
      }
      
    } catch (err) {
      console.error("❌ Error en fetchProject:", err);
      setProjectError(err.message);
      
      // Debug adicional: probar si el endpoint existe
      console.log("🔄 Probando acceso básico al endpoint...");
      try {
        const testResponse = await fetch('http://localhost:3001/ProjectsgetById');
        console.log("🔍 Test endpoint status:", testResponse.status);
      } catch (testError) {
        console.error("🔍 Test endpoint failed:", testError);
      }
    } finally {
      setLoading(false);
    }
  }, [idProject]);

  useEffect(() => {
    console.log("🔄 useEffect ejecutándose con idProject:", idProject);
    if (idProject) {
      fetchProject();
    }
  }, [fetchProject, idProject]);

  // Estados de carga mejorados
  if (!idProject) {
    return (
      <Container fluid className="p-4">
        <div className="alert alert-danger">
          <h4>Error: ID no encontrado</h4>
          <p>La URL debe contener un ID de proyecto válido.</p>
          <p>Ejemplo: <code>http://localhost:3000/project/6</code></p>
          <p>URL actual: <code>{window.location.href}</code></p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Recargar página
          </Button>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container fluid className="p-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando proyecto...</span>
          </div>
          <p>Cargando proyecto ID: {idProject}</p>
          <small className="text-muted">Verifica la consola para más detalles</small>
        </div>
      </Container>
    );
  }

  if (projectError) {
    return (
      <Container fluid className="p-4">
        <div className="alert alert-danger">
          <h4>Error al cargar el proyecto</h4>
          <p><strong>Mensaje:</strong> {projectError}</p>
          <p><strong>ID intentado:</strong> {idProject}</p>
          <div className="mt-3">
            <Button variant="primary" onClick={fetchProject} className="me-2">
              Reintentar
            </Button>
            <Button variant="secondary" onClick={() => console.log("Debug info above")}>
              Ver detalles en consola
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container fluid className="p-4">
        <div className="alert alert-warning">
          <h4>Proyecto no encontrado</h4>
          <p>No se pudo cargar el proyecto con ID: {idProject}</p>
          <p>El servidor respondió pero la estructura del proyecto no es la esperada.</p>
          <Button variant="primary" onClick={fetchProject}>
            Reintentar
          </Button>
        </div>
      </Container>
    );
  }

  // Calcular estadísticas de tareas con manejo de errores
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

  console.log("📊 Estadísticas calculadas:", {
    totalTasks,
    completedTasks,
    inProgressTasks,
    pendingTasks
  });

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="dashboard-title">
          Gestión de Funcionalidades - {project.nameProject || 'Proyecto sin nombre'}
        </h2>
        <div>
          <small className="text-muted">ID: {idProject}</small>
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

      {/* Tarjetas de estadística */}
      <Row className="mb-4">
        <Col >
          <ProgressCard
            title="Progreso General"
            icon={<GraphUp />}
            completed={completedTasks}
            total={totalTasks}
            unit="tareas"
          />
        </Col>

        <Col >
          <StatCard
            title="TAREAS COMPLETADAS"
            value={completedTasks}
            description="Tareas completadas"
            icon={<CheckCircleFill />}
            variant="success"
          />
        </Col>

        <Col >
          <StatCard
            title="EN PROGRESO"
            value={inProgressTasks}
            description="Tareas activas"
            icon={<ClockHistory />}
            variant="primary"
          />
        </Col>

       
      </Row>

      {/* Tarjetas de recursos y progreso por funcionalidad */}
      <Row className="mb-4">
        <Col xs={12} lg={6}>
          <ResourceCard resources={project} />
        </Col>
        <Col xs={12} lg={6}>
          <ProgressByFeatureCard features={project.functions || []} />
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
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Project;