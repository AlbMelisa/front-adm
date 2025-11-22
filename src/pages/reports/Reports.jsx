import React, { useEffect, useState } from "react";
import { FileText, TrendingUp, Users, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./reports.css";

const Reports = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    activeProjects: 0,
    completedProjects: 0,
    avgProgress: 0,
    totalTeams: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:3001/projectsWithProgress");
        const data = await res.json();

        const projectsList = data.projectsWithProgress || [];
        setProjects(projectsList);

        // 📌 Calcular métricas
        let active = 0;
        let completed = 0;
        let progressSum = 0;
        let totalTeams = 0;

        const chart = projectsList.map((p) => {
          const proj = p.projectData;

          if (proj.stateProject === "In_Progress") active++;
          if (proj.stateProject === "Completed") completed++;

          progressSum += p.progressPorcentage;
          totalTeams += proj.teamNumber;

          return {
            name: proj.nameProject,
            progress: p.progressPorcentage,
          };
        });

        setMetrics({
          activeProjects: active,
          completedProjects: completed,
          avgProgress:
            projectsList.length > 0
              ? (progressSum / projectsList.length).toFixed(1)
              : 0,
          totalTeams,
        });

        setChartData(chart);
      } catch (err) {
        console.error("Error obteniendo reportes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <h2>Cargando reportes...</h2>;

  return (
    <div className="reports-container">
      <h1>Reportes de Proyecto</h1>

      {/* 🔹 TARJETAS DE MÉTRICAS */}
      <div className="reports-cards">
        <div className="report-card">
          <FileText className="card-icon" size={32} />
          <h3>Proyectos Activos</h3>
          <h2>{metrics.activeProjects}</h2>
          <p>Actualmente en curso</p>
        </div>

        <div className="report-card">
          <TrendingUp className="card-icon" size={32} />
          <h3>Progreso Promedio</h3>
          <h2>{metrics.avgProgress}%</h2>
          <p>Entre todos los proyectos</p>
        </div>

        <div className="report-card">
          <Users className="card-icon" size={32} />
          <h3>Equipos Totales Asignados</h3>
          <h2>{metrics.totalTeams}</h2>
          <p>Suma de teamNumber</p>
        </div>

        <div className="report-card">
          <Clock className="card-icon" size={32} />
          <h3>Proyectos Finalizados</h3>
          <h2>{metrics.completedProjects}</h2>
          <p>Marcados como Completed</p>
        </div>
      </div>

      {/* 🔹 GRÁFICO DE BARRAS */}
      <div className="chart-container">
        <h2>Progreso por Proyecto</h2>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="progress" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Reports;
