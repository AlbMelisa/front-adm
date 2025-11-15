import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ProyectStatus = ({ Proyect }) => {

  const counts = {
    "Pendiente": 0,
    "En Curso": 0,
    "Terminado": 0,
  };
console.log("Estados:", Proyect.map(p => p.estadoProyecto));

  Proyect.forEach((p) => {
  const estado = p.estadoProyecto?.trim().toLowerCase();

  if (estado === "En Progreso") counts["En Progreso"]++;
  if (estado === "en curso") counts["En Curso"]++;
  if (estado === "terminado") counts["Terminado"]++;
});

  const data = [
    { estado: "En Progreso", cantidad: counts["En Progreso"] },
    { estado: "En Curso", cantidad: counts["En Curso"] },
    { estado: "Terminado", cantidad: counts["Terminado"] },
  ];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="estado" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#d64becff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProyectStatus;
