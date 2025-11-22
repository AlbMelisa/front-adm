import { Form, Row, Col, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import "./createProject.css";
import { useEffect, useState } from "react";

const defaultValues = {
  clientName: "",
  teamNumber: 0,
  nameProject: "",
  typeProject: "",
  descriptionProject: "",
  dataEnd: "",
  priorityProject: 0,
  budgetProject: "0.00",
  functions: [],
};

const CreateProject = () => {
  const [clientesList, setClientesList] = useState([]);
  const [team, setTeam] = useState([]);
  const navigate = useNavigate();

  // 1. Cargar Clientes (Con Token y corrección de error)
// 1. Cargar Clientes
 // 1. Cargar Clientes (DATOS PROVISORIOS ACTIVOS)
  useEffect(() => {


    // C. Mantenemos la lógica de la API comentada para el futuro
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5111/api/Clients/getAll", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Error al obtener clientes");

        const data = await res.json();
        
        if (data.clientsRegistered) {
             setClientesList(data.clientsRegistered);
        } else {
             setClientesList([]);
        }

      } catch (err) {
        console.error("Error cargando clientes:", err.message);
      } 
    };

    fetchClients(); 
    
  }, []);

  // 2. Cargar Equipos (Con Token y corrección de error)
  // 2. Cargar Equipos
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5111/api/Teams", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Error al obtener team");

        const data = await res.json();
        
        // --- CAMBIO AQUÍ ---
        // Antes tenías: setTeam(data); 
        // Ahora debes acceder a la propiedad que tiene el array:
        if (data.teamsRegistered) {
            setTeam(data.teamsRegistered);
        } else {
            setTeam([]); // Por seguridad, si viene vacío
        }

      } catch (err) {
        console.error("Error cargando equipos:", err.message);
      } 
    };

    fetchTeam();
  }, []);
 
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    mode: "all",
  });

  // Campo dinámico para FUNCTIONS
  const { fields, append, remove } = useFieldArray({
    control,
    name: "functions",
  });

  // Convierte dd/mm/yyyy → yyyy-mm-ddT00:00:00
  const convertDate = (value) => {
    const [day, month, year] = value.split("/");
    return `${year}-${month}-${day}T00:00:00`;
  };

  // 3. Submit (Con Token)
// 3. Submit (Con Token)
  const onSubmit = async (formData) => {
    const endpoint = "http://localhost:5111/api/Projects";

    const payload = {
      idClient: parseInt(formData.clientName),
      idTeam: parseInt(formData.teamNumber),
      nameProject: formData.nameProject,
      typeProject: formData.typeProject,
      descriptionProject: formData.descriptionProject,
      // Asegúrate de que convertDate maneje bien la fecha o usa null
      dataEnd: formData.dataEnd ? convertDate(formData.dataEnd) : null,
      priorityProject: parseInt(formData.priorityProject),
      budgetProject: parseFloat(formData.budgetProject),
      functions: formData.functions
    };
    console.log(payload)
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      console.log("TOKEN:", token);

      if (!response.ok) {
        let msg = `Error ${response.status}`;
        try {
          const err = await response.json();
          if (err.message) msg = err.message;
          else if (err.title) msg = err.title;
        } catch {}
        throw new Error(msg);
      }

      alert("¡Proyecto creado exitosamente!");
      navigate("/projectslist");

    } catch (err) {
      console.error(err);
      alert("Error al crear proyecto: " + err.message);
    }
  };

  return (
    <Container className="p-4 my-5 bg-white shadow-lg rounded-3">
      <h2 className="mb-4 form-title-custom">Información del Proyecto</h2>

      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="nameProject">
              <Form.Label>
                Nombre del Proyecto <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                {...register("nameProject", {
                  required: "El nombre es obligatorio.",
                })}
                type="text"
                placeholder="Nombre del proyecto"
                isInvalid={!!errors.nameProject}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nameProject?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* === RESPONSABLE / idTeam === */}
          <Col md={6}>
            <Form.Group controlId="teamNumber">
              <Form.Label>
                Equipo <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                {...register("teamNumber", {
                  required: "Debe seleccionar un responsable.",
                })}
                isInvalid={!!errors.teamNumber}
              >
                <option value="">Seleccione el equipo...</option>
                {team.map((r) => (
                  <option key={r.idTeam} value={r.idTeam}>
                    {r.numberTeam}
                  </option>
                ))}
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                {errors.teamNumber?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* === DESCRIPCIÓN === */}
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="descriptionProject">
              <Form.Label>
                Descripción del Proyecto <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describa el proyecto"
                {...register("descriptionProject", {
                  required: "La descripción es obligatoria.",
                })}
                isInvalid={!!errors.descriptionProject}
              />
              <Form.Control.Feedback type="invalid">
                {errors.descriptionProject?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* === FUNCIONALIDADES DINÁMICAS === */}
        <Row className="mb-3">
          <Col>
            <Form.Label className="pe-2">Funcionalidades</Form.Label>

            {fields.map((field, index) => (
              <div key={field.id} className="mb-3 p-3 border rounded">
                <Row className="mb-2">
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Nombre de la funcionalidad"
                      {...register(`functions.${index}.functionName`, {
                        required: "Campo obligatorio",
                      })}
                      isInvalid={!!errors.functions?.[index]?.functionName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.functions?.[index]?.functionName?.message}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md="auto">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      X
                    </Button>
                  </Col>
                </Row>

                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Descripción de la funcionalidad"
                  {...register(`functions.${index}.functionDescription`, {
                    required: "Campo obligatorio",
                  })}
                  isInvalid={!!errors.functions?.[index]?.functionDescription}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.functions?.[index]?.functionDescription?.message}
                </Form.Control.Feedback>
              </div>
            ))}

            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                append({
                  functionName: "",
                  functionDescription: "",
                })
              }
            >
              + Agregar funcionalidad
            </Button>
          </Col>
        </Row>

        {/* === CLIENTE === */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="clientName">
              <Form.Label>
                Cliente <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                {...register("clientName", {
                  required: "Debe seleccionar un cliente.",
                })}
                isInvalid={!!errors.clientName}
              >
                <option value="">Seleccione el cliente</option>
                {clientesList.map((c) => (
                  <option key={c.idClient} value={c.idClient}>
                    {c.fullNameClient}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.clientName?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* === TIPO === */}
          <Col md={6}>
            <Form.Group controlId="typeProject">
              <Form.Label>
                Tipo de Proyecto <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                {...register("typeProject", {
                  required: "Seleccione un tipo.",
                })}
                isInvalid={!!errors.typeProject}
              >
                <option value="">Seleccione el tipo</option>
                <option value="Web">Web</option>
                <option value="Escritorio">Escritorio</option>
                <option value="Mobile">Mobile</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.typeProject?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* === PRIORIDAD / FECHA / PRESUPUESTO === */}
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group controlId="priorityProject">
              <Form.Label>Prioridad</Form.Label>
              <Form.Select
                {...register("priorityProject", {
                  required: "Seleccione una prioridad.",
                })}
                isInvalid={!!errors.priorityProject}
              >
                <option value="">Seleccione</option>
                <option value="0">Alta</option>
                <option value="1">Media</option>
                <option value="2">Baja</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.priorityProject?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="dataEnd">
              <Form.Label>Fecha de Fin</Form.Label>
              <Form.Control
                type="text"
                placeholder="dd/mm/aaaa"
                {...register("dataEnd", {
                  required: "Fecha obligatoria",
                  pattern: {
                    value: /^\d{2}\/\d{2}\/\d{4}$/,
                    message: "Formato inválido (use dd/mm/aaaa)",
                  },
                })}
                isInvalid={!!errors.dataEnd}
              />
              <Form.Control.Feedback type="invalid">
                {errors.dataEnd?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="budgetProject">
              <Form.Label>Presupuesto Total</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                {...register("budgetProject", {
                  required: "Ingrese un monto",
                  min: {
                    value: 0.01,
                    message: "Debe ser mayor a 0",
                  },
                })}
                isInvalid={!!errors.budgetProject}
              />
              <Form.Control.Feedback type="invalid">
                {errors.budgetProject?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* BOTONES */}
        <div className="mt-4">
          <Button type="submit" className="me-3 create-btn-custom">
            Crear Proyecto
          </Button>

          <Button
            variant="light"
            onClick={() => navigate("/projectslist")}
            className="cancel-btn-custom"
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateProject;
