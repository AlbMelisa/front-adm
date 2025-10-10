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
  const [reportData, setReportData] = useState({
    activeProjects: 0,
    completedRate: 0,
    teamMembers: 0,
    workedHours: 0,
  });

  const [activityData, setActivityData] = useState([]);

  // Simulación de "fetch" desde API
  useEffect(() => {
    const simulatedAPIResponse = {
      activeProjects: 12,
      completedRate: 87,
      teamMembers: 24,
      workedHours: 1248,
      activitySummary: [
        { mes: "Enero", horas: 900 },
        { mes: "Febrero", horas: 1100 },
        { mes: "Marzo", horas: 980 },
        { mes: "Abril", horas: 1200 },
        { mes: "Mayo", horas: 1250 },
        { mes: "Junio", horas: 1000 },
        { mes: "Julio", horas: 1300 },
        { mes: "Agosto", horas: 1248 },
        { mes: "Septiembre", horas: 1350 },
        { mes: "Octubre", horas: 1420 },
      ],
    };

    // Simular un retardo de red
    setTimeout(() => {
      setReportData({
        activeProjects: simulatedAPIResponse.activeProjects,
        completedRate: simulatedAPIResponse.completedRate,
        teamMembers: simulatedAPIResponse.teamMembers,
        workedHours: simulatedAPIResponse.workedHours,
      });

      setActivityData(simulatedAPIResponse.activitySummary);
    }, 800);
  }, []);
  return (
     <div className="reports-container">
      <h1>Reportes</h1>

      {/* 🔹 Tarjetas métricas */}
      <div className="reports-cards">
        <div className="report-card">
          <FileText className="card-icon" size={32} />
          <h3>Proyectos Activos</h3>
          <h2>{reportData.activeProjects}</h2>
          <p>+3 este mes</p>
        </div>

        <div className="report-card">
          <TrendingUp className="card-icon" size={32} />
          <h3>Tasa de Completado</h3>
          <h2>{reportData.completedRate}%</h2>
          <p>+5% vs mes anterior</p>
        </div>

        <div className="report-card">
          <Users className="card-icon" size={32} />
          <h3>Miembros del Equipo</h3>
          <h2>{reportData.teamMembers}</h2>
          <p>+2 nuevos</p>
        </div>

        <div className="report-card">
          <Clock className="card-icon" size={32} />
          <h3>Horas Trabajadas</h3>
          <h2>{reportData.workedHours.toLocaleString()}</h2>
          <p>Este mes</p>
        </div>
      </div>

      {/* 🔹 Gráfico de actividad */}
      <div className="reports-activity">
        <h2>Resumen de Actividad</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="horas" fill="#a855f7" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Reports