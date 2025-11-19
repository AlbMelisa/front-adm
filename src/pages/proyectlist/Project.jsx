import React, { useEffect, useState } from "react";
import ListProyects from "../../components/list/ListProjects";
import { Button, Container } from "react-bootstrap";
import ProyectStatus from "../../components/proyectStatus/ProyectStatus";
import { useNavigate } from "react-router-dom";
import ListProjects from "../../components/list/ListProjects";
import '../project/project.css'

const ProjectList = () => {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState([]);

  const endpoint = "http://localhost:3001/Projects";

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Error al obtener los proyectos");

        const data = await response.json();
        console.log(data)
        setProyectos(data); // Guardamos los datos en el estado
      } catch (error) {
        console.error("Error:", error);
      }
    };
    

    fetchProyectos();
  }, []);
  return (
    <Container>
      <div className="d-flex mb-3 justify-content-between pt-4">
        <h4 className="mb-3">Proyectos Registrados</h4>
        <Button
          className="new-proyect"
          variant="secondary"
          onClick={() => navigate(`/projectslist/project/create`)}
        >
          Nuevo Proyecto
        </Button>
      </div>

      {/* Gráfico de estado de proyectos 
      <ProyectStatus Proyect={proyectos} />

      {/* Lista de proyectos */}
      <ListProjects   />
    </Container>
  );
};


export default ProjectList
