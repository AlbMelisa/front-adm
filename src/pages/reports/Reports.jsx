import { useEffect, useState } from "react";
import { Container, Row, Col, ProgressBar, Badge, Table } from "react-bootstrap";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import "./reports.css";

export default function ProjectReports() {
  // --- Estados de Proyectos ---
  const [projects, setProjects] = useState([]);
  const [averageProgress, setAverageProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  // --- Estados de Equipos (NUEVO) ---
  const [teamData, setTeamData] = useState([]);
  
  // --- Estados Generales ---
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar ambos datos al iniciar
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([fetchProjects(), fetchTeamPerformance()]);
      setLoading(false);
    };

    loadAllData();
  }, []);

  // 1. Fetch de Proyectos (Existente)
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5111/api/Dashboard/getProgress",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const list = data.projectsWithProgress || [];
        setProjects(list);

        const avg =
          list.length > 0
            ? list.reduce((sum, p) => sum + p.progressPorcentage, 0) / list.length
            : 0;

        setAverageProgress(avg.toFixed(1));

        const completed = list.filter(
          (p) => p.projectData.stateProject === "Completed"
        ).length;

        setCompletedCount(completed);
      }
    } catch (err) {
      console.error("Error al obtener proyectos:", err);
    }
  };

  // 2. Fetch de Rendimiento de Equipos (NUEVO)
  const fetchTeamPerformance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5111/api/Dashboard/getLoadPerTeam",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const result = await res.json();
        // Mapeamos result.teamWithPerfermance según tu JSON
        if (result && result.teamWithPerfermance) {
          setTeamData(result.teamWithPerfermance);
        }
      }
    } catch (err) {
      console.error("Error al obtener equipos:", err);
    }
  };

  // Datos para el gráfico de Proyectos
  const projectChartData = projects.map((p) => ({
    name: p.projectData.nameProject,
    progreso: p.progressPorcentage,
  }));

  // Datos para el gráfico de Equipos (Mapeo directo del estado)
  // Recharts puede usar teamData directamente porque las claves coinciden (teamNumber, projectsCount, etc)

  return (
    <div className="m-5 pr-container">
      {/* TITULO */}
      <h2 className="pr-title mt-2">Reportes de Gestión</h2>
      <p className="pr-subtitle">
        Visualiza el progreso de proyectos y el rendimiento de los equipos
      </p>

      {/* --- SECCIÓN 1: KPI CARDS --- */}
      <Row className="mb-4">
        <Col md={4}>
          <div className="pr-card-custom">
            <h6 className="pr-metric-title">Total Proyectos</h6>
            <h2 className="pr-metric-value">{projects.length}</h2>
            <p className="pr-metric-sub">proyectos activos</p>
          </div>
        </Col>

        <Col md={4}>
          <div className="pr-card-custom">
            <h6 className="pr-metric-title">Progreso Promedio</h6>
            <h2 className="pr-metric-value">{averageProgress}%</h2>
            <p className="pr-metric-sub">de completitud general</p>
          </div>
        </Col>

        <Col md={4}>
          <div className="pr-card-custom">
            <h6 className="pr-metric-title">Completados</h6>
            <h2 className="pr-metric-value">{completedCount}</h2>
            <p className="pr-metric-sub">proyectos finalizados</p>
          </div>
        </Col>
      </Row>

      {/* --- SECCIÓN 2: GRÁFICO DE PROYECTOS --- */}
      <div className="pr-card-custom mb-4 pr-chart-custom w-100">
        <h6 className="fw-bold mb-3">Progreso por Proyecto</h6>
        <div className="pr-chart-wrapper" style={{ height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progreso" fill="#b34eff" name="Progreso %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- SECCIÓN 3: RENDIMIENTO DE EQUIPOS (NUEVO) --- */}
      <Row>
        {/* Gráfico de Carga de Trabajo */}
        <Col lg={6} className="mb-4">
          <div className="pr-card-custom h-100">
            <h6 className="fw-bold mb-3">Carga de Trabajo por Equipo</h6>
            <div style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="teamNumber" tickFormatter={(val) => `Eq. ${val}`} />
                  <YAxis />
                  <Tooltip 
                     formatter={(value, name) => [value, name === 'projectsCount' ? 'Total Asignado' : 'Completados']}
                  />
                  <Legend />
                  <Bar dataKey="projectsCount" name="Total Proyectos" fill="#9c3cafff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="numberCompletedProjects" name="Completados" fill="#4ecf92" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>

        {/* Tabla de Eficiencia */}
        <Col lg={6} className="mb-4">
          <div className="pr-card-custom h-100">
            <h6 className="fw-bold mb-3">Detalle de Eficiencia</h6>
            <Table hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Equipo</th>
                  <th className="text-center">Carga</th>
                  <th>Eficiencia</th>
                </tr>
              </thead>
              <tbody>
                {teamData.length > 0 ? (
                  teamData.map((team) => {
                    // Calculo de porcentaje seguro
                    const percentage = team.projectsCount === 0 
                      ? 0 
                      : Math.round((team.numberCompletedProjects / team.projectsCount) * 100);
                    
                    // Color dinámico
                    let variant = "primary"; // por defecto azul/morado
                    if (percentage === 100) variant = "success";
                    else if (percentage < 30) variant = "warning";

                    return (
                      <tr key={team.teamNumber}>
                        <td className="fw-bold">Equipo {team.teamNumber}</td>
                        <td className="text-center">
                          <Badge bg="light" text="dark" className="border">
                            {team.numberCompletedProjects} / {team.projectsCount}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1 me-2">
                              <ProgressBar 
                                now={percentage} 
                                variant={variant} 
                                style={{ height: "6px" }} 
                              />
                            </div>
                            <small className="text-muted fw-bold">{percentage}%</small>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">No hay datos de equipos</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

    </div>
  );
}