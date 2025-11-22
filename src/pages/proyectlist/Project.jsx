import React, { useEffect, useState } from "react";
import ListProyects from "../../components/list/ListProjects";
import { Button, Container } from "react-bootstrap";
import ProyectStatus from "../../components/proyectStatus/ProyectStatus";
import { useNavigate } from "react-router-dom";
import ListProjects from "../../components/list/ListProjects";
import "../project/project.css";

const ProjectList = () => {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedUserStr = localStorage.getItem("user");
    if (storedUserStr) {
      try {
        const userObj = JSON.parse(storedUserStr);
        if (userObj && userObj.rolEmployee) {
          setUserRole(userObj.rolEmployee);
        }
      } catch (error) {
        console.error("Error al leer usuario:", error);
      }
    }
  }, []);

  return (
    <Container>
      <div className="d-flex justify-content-between pt-4 m-3">
        <h4 className="mb-3">Proyectos Registrados</h4>
        {["Administrator"].includes(userRole) && (
          <Button
            className="new-proyect"
            variant="secondary"
            onClick={() => navigate(`/projectslist/project/create`)}
          >
            Nuevo Proyecto
          </Button>
        )}
      </div>
      <ListProjects />
    </Container>
  );
};

export default ProjectList;
