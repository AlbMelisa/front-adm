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

        // Sumar proyectos completados de los proyectos individuales
        const completed = list.reduce(
          (sum, p) => sum + (p.numberCompletedProjects || 0),
          0
        );

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
        console.log(result)
        // Mapeamos result.teamWithPerfermance según tu JSON
        if (result && result.teamWithPerfermance) {
          setTeamData(result.teamWithPerfermance);
          
          // ⭐ SUMAR PROYECTOS COMPLETADOS DE TODOS LOS EQUIPOS
          const totalCompletedFromTeams = result.teamWithPerfermance.reduce(
            (total, team) => total + (team.numberCompletedProjects || 0),
            0
          );
          
          console.log("Total completados de equipos:", totalCompletedFromTeams);
          
          // Opcional: Actualizar el estado de completedCount con la suma de equipos
          // setCompletedCount(totalCompletedFromTeams);
        }
      }
    } catch (err) {
      console.error("Error al obtener equipos:", err);
    }
  };

  // ⭐ FUNCIÓN PARA CALCULAR EL TOTAL DE PROYECTOS COMPLETADOS DE TODOS LOS EQUIPOS
  const getTotalCompletedFromTeams = () => {
    return teamData.reduce(
      (total, team) => total + (team.numberCompletedProjects || 0),
      0
    );
  };

  // ⭐ FUNCIÓN PARA CALCULAR EL TOTAL DE PROYECTOS ASIGNADOS A TODOS LOS EQUIPOS
  const getTotalProjectsFromTeams = () => {
    return teamData.reduce(
      (total, team) => total + (team.projectsCount || 0),
      0
    );
  };

  // Datos para el gráfico de Proyectos
  const projectChartData = projects.map((p) => ({
    name: p.projectData.nameProject,
    progreso: p.progressPorcentage,
  }));

  // Calcular totales (para usar en donde necesites)
  const totalCompletedTeams = getTotalCompletedFromTeams();
  const totalProjectsTeams = getTotalProjectsFromTeams();

  return (
    <div className="m-5 pr-container">
      {/* TITULO */}
      <h2 className="pr-title mt-2">Reportes de Gestión</h2>
      <p className="pr-subtitle">
        Visualiza el progreso de proyectos y el rendimiento de los equipos
      </p>

      {/* --- SECCIÓN 1: KPI CARDS --- */}
      <Row className="mb-4">
        <Col >
          <div className="pr-card-custom">
            <h6 className="pr-metric-title">Total Proyectos</h6>
            <h2 className="pr-metric-value">{projects.length}</h2>
            <p className="pr-metric-sub">proyectos activos</p>
          </div>
        </Col>

        <Col >
          <div className="pr-card-custom">
            <h6 className="pr-metric-title">Progreso Promedio</h6>
            <h2 className="pr-metric-value">{averageProgress}%</h2>
            <p className="pr-metric-sub">de completitud general</p>
          </div>
        </Col>

        {/* <Col md={3}>
          <div className="pr-card-custom">
            <h6 className="pr-metric-title">Completados</h6>
            <h2 className="pr-metric-value">{completedCount}</h2>
            <p className="pr-metric-sub">proyectos finalizados</p>
          </div>
        </Col> */}

        {/* ⭐ NUEVO KPI: TOTAL COMPLETADOS DE EQUIPOS */}
        <Col >
          <div className="pr-card-custom">
            <h6 className="pr-metric-title">Completados por Equipos</h6>
            <h2 className="pr-metric-value">{totalCompletedTeams}</h2>
            <p className="pr-metric-sub">
              de {totalProjectsTeams} asignados
            </p>
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
            
            {/* ⭐ RESUMEN DE TOTALES */}
            <div className="mb-3 p-3 border rounded bg-light">
              <div className="d-flex justify-content-between">
                <span><strong>Total completados:</strong></span>
                <span><strong>{totalCompletedTeams} / {totalProjectsTeams}</strong></span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Porcentaje general:</span>
                <span>
                  <Badge bg={
                    totalProjectsTeams === 0 ? 'secondary' : 
                    (totalCompletedTeams / totalProjectsTeams) >= 0.7 ? 'success' : 
                    (totalCompletedTeams / totalProjectsTeams) >= 0.4 ? 'warning' : 'danger'
                  }>
                    {totalProjectsTeams === 0 ? '0%' : 
                     Math.round((totalCompletedTeams / totalProjectsTeams) * 100)}%
                  </Badge>
                </span>
              </div>
            </div>

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