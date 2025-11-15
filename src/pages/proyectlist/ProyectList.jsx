import React, { useEffect, useState } from "react";
import ListProyects from "../../components/list/ListProyects";
import { Button, Container } from "react-bootstrap";
import ProyectStatus from "../../components/proyectStatus/ProyectStatus";
import { useNavigate } from "react-router-dom";

const ProyectList = () => {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState([]);

  const endpoint = "http://localhost:3001/proyectos";

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
          variant="secondary"
          onClick={() => navigate(`/proyectslist/proyect/create`)}
        >
          Nuevo Proyecto
        </Button>
      </div>

      {/* Gráfico de estado de proyectos */}
      <ProyectStatus Proyect={proyectos} />

      {/* Lista de proyectos */}
      <ListProyects  />
    </Container>
  );
};


export default ProyectList
