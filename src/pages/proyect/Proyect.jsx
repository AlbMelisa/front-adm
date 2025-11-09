import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import StatCard from "../../components/statCard/StatCard";
import { GraphUp, CheckCircleFill, ClockHistory, PauseCircle } from 'react-bootstrap-icons';import { Container } from "react-bootstrap";
import ProgressCard from "../../components/progressCard/ProgressCard";
import { useState } from "react";
import ResourceCard from "../../components/resourceCard/ResourceCard";
import ProgressByFeatureCard from "../../components/progressByFeatureCard/ProgressByFeatureCard";
import { useParams } from "react-router-dom";

const Proyect = () => {
  const { idProyecto } = useParams();

  const [tasks, setTasks] = useState([
    { id: 1, completed: true },
    { id: 2, completed: false },
    { id: 3, completed: true },
  ]);

  const featureData = [
    { id: 'f1', name: 'Sistema de Autenticacion', completed: 1, total: 2 },
    { id: 'f2', name: 'Cargar Datos', completed: 1, total: 1 }
  ];
  const resourceData = {
    total: 3,
    humanos: 3,
    materiales: 0,
    tecnologicos: 2,
    financieros: 0
  };

  const totalTasks = tasks.length; // 3
  const completedTasks = tasks.filter(task => task.completed).length; // 2
  const inProgressTasks = 0; // Lógica para calcular esto...
  const pendingTasks = 1;    // Lógica para calcular esto...
  
  return (
    <Container fluid className="p-4">
      <Row >
        <Col>
         <ProgressCard
            title="Progreso General"
            icon={<GraphUp />}
            completed={completedTasks}
            total={totalTasks}
            unit="tareas"
          />
        </Col>
        <Col>
          <StatCard
            title="TAREAS COMPLETADAS"
            value="2"
            description="Tareas completadas"
            icon={<CheckCircleFill />}
            variant="success"
          />
        </Col>
        <Col>
          <StatCard
            title="EN PROGRESO"
            value="2"
            description="Tareas activas"
            icon={<ClockHistory />}
            variant="primary"
          />
        </Col>
        <Col>
          <StatCard
            title="PENDIENTES"
            value="2"
            description="Tareas por realizar"
            icon={<PauseCircle />}
            variant="muted"
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <ResourceCard resources={resourceData}/>
        </Col>
        <Col>
          <ProgressByFeatureCard features={featureData}/>
        </Col>
      </Row>
    </Container>
  );
};

export default Proyect;
