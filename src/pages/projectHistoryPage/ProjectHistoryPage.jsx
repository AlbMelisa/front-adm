// ProjectHistoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Alert, Button } from "react-bootstrap";
import "../../components/projectHistory/projectHistory.css";
import ProjectHistory from "../../components/projectHistory/ProjectHistory";

const ProjectHistoryPage = () => {
  const { idProject } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:5111/api/Projects/getHistoryById/${idProject}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        setProjectData(json.projectWithHistory || null);
      } catch (err) {
        console.error("fetch error:", err);
        setError("No se pudo cargar el historial del proyecto.");
      } finally {
        setLoading(false);
      }
    };

    if (idProject) fetchHistory();
  }, [idProject]);

  return (
    <div className="ph-page m-4 py-4">
      <div className="ph-header d-flex align-items-center justify-content-between mb-3">
        <div>
          <h1 className="ph-title mb-0">{projectData?.nameProject || "Proyecto"}</h1>
          <small className="text-muted">{projectData?.typeProject}</small>
        </div>
        <div>
          <Button variant="light" onClick={() => navigate(-1)}>← Volver</Button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-6">
          <Spinner animation="border" />
          <div>Cargando historial...</div>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {projectData && (
        <ProjectHistory historyData={projectData} />
      )}
    </div>
  );
};

export default ProjectHistoryPage;
