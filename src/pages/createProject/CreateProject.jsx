import { Form, Row, Col, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import "./createProject.css";
import { useEffect, useState } from "react";

const CreateProject = () => {
  const [clientesList, setClientesList] = useState([]);
  const [team, setTeam] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const navigate = useNavigate();

  // 1. Cargar Clientes
  useEffect(() => {
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
        showAlertMessage("Error al cargar la lista de clientes", "danger");
      } 
    };

    fetchClients(); 
  }, []);

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
        
        if (data.teamsRegistered) {
            setTeam(data.teamsRegistered);
        } else {
            setTeam([]);
        }

      } catch (err) {
        console.error("Error cargando equipos:", err.message);
        showAlertMessage("Error al cargar la lista de equipos", "danger");
      } 
    };

    fetchTeam();
  }, []);

  // Función para mostrar alertas
  const showAlertMessage = (message, variant = "success") => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    
    setTimeout(() => {
      setShowAlert(false);
    }, variant === "success" ? 5000 : 7000);
  };

  // Configuración de react-hook-form con todas las validaciones
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    watch,
    trigger,
    setValue
  } = useForm({
    mode: "onChange",
    defaultValues: {
      clientName: "",
      teamNumber: "",
      nameProject: "",
      typeProject: "",
      descriptionProject: "",
      dataEnd: "",
      priorityProject: "",
      budgetProject: "0.00",
      functions: [],
    }
  });

  // Campo dinámico para FUNCTIONS
  const { fields, append, remove } = useFieldArray({
    control,
    name: "functions",
  });

  // Watch para contadores de caracteres
  const watchDescription = watch("descriptionProject", "");
  const watchFunctions = watch("functions", []);

  // Convierte dd/mm/yyyy → yyyy-mm-ddT00:00:00
  const convertDate = (value) => {
    if (!value) return null;
    const [day, month, year] = value.split("/");
    return `${year}-${month}-${day}T00:00:00`;
  };

  // Validación personalizada para fecha futura
  const validateFutureDate = (value) => {
    if (!value) return true;
    
    // Validar formato
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(value)) return "Formato inválido (use dd/mm/aaaa)";
    
    // Validar fecha real
    const [day, month, year] = value.split('/');
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (inputDate.getMonth() + 1 !== parseInt(month)) {
      return "Fecha inválida";
    }
    
    if (inputDate <= today) {
      return "La fecha debe ser futura";
    }
    
    return true;
  };

  // Submit handler
  const onSubmit = async (formData) => {
    const endpoint = "http://localhost:5111/api/Projects";

    const payload = {
      idClient: parseInt(formData.clientName),
      idTeam: parseInt(formData.teamNumber),
      nameProject: formData.nameProject.trim(),
      typeProject: formData.typeProject,
      descriptionProject: formData.descriptionProject.trim(),
      dataEnd: convertDate(formData.dataEnd),
      priorityProject: parseInt(formData.priorityProject),
      budgetProject: parseFloat(formData.budgetProject),
      functions: formData.functions.map(func => ({
        functionName: func.functionName?.trim() || "",
        functionDescription: func.functionDescription?.trim() || ""
      }))
    };

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

      if (!response.ok) {
        let msg = `Error ${response.status}`;
        try {
          const err = await response.json();
          msg = err.message || err.title || msg;
        } catch {}
        throw new Error(msg);
      }

      showAlertMessage("¡Proyecto creado exitosamente!", "success");
      
      setTimeout(() => {
        navigate("/projectslist");
      }, 2000);

    } catch (err) {
      console.error("Error al crear proyecto:", err);
      showAlertMessage("Error al crear proyecto: " + err.message, "danger");
    }
  };

  return (
    <Container className="p-4 my-5 shadow-lg container-form">
      {/* Alert de Bootstrap */}
      <Alert 
        show={showAlert} 
        variant={alertVariant} 
        dismissible 
        onClose={() => setShowAlert(false)}
        className="mt-3"
      >
        <Alert.Heading>
          {alertVariant === "success" ? "¡Éxito!" : "Error"}
        </Alert.Heading>
        {alertMessage}
      </Alert>

      <h2 className="mb-4 form-title-custom">Información del Proyecto</h2>

      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="nameProject">
              <Form.Label>
                Nombre del Proyecto <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
              className="form-color"
                {...register("nameProject", {
                  required: "El nombre del proyecto es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres"
                  },
                  maxLength: {
                    value: 100,
                    message: "El nombre no puede exceder 100 caracteres"
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_.,()]+$/,
                    message: "El nombre contiene caracteres no válidos"
                  }
                })}
                type="text"
                placeholder="Nombre del proyecto"
                isInvalid={!!errors.nameProject}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nameProject?.message}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Mínimo 3 caracteres, máximo 100 caracteres
              </Form.Text>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="teamNumber">
              <Form.Label>
                Equipo <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
              className="form-color"
                {...register("teamNumber", {
                  required: "Debe seleccionar un equipo",
                  validate: value => value !== "" || "Seleccione un equipo válido"
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

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="descriptionProject">
              <Form.Label>
                Descripción del Proyecto <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
              className="form-color"
                as="textarea"
                rows={3}
                placeholder="Describa el proyecto"
                {...register("descriptionProject", {
                  required: "La descripción es obligatoria",
                  minLength: {
                    value: 10,
                    message: "La descripción debe tener al menos 10 caracteres"
                  },
                  maxLength: {
                    value: 40,
                    message: "La descripción no puede exceder 40 caracteres"
                  }
                })}
                isInvalid={!!errors.descriptionProject}
              />
              <Form.Control.Feedback type="invalid">
                {errors.descriptionProject?.message}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                {watchDescription.length}/40 caracteres
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Label className="pe-2">Funcionalidades</Form.Label>

            {fields.map((field, index) => (
              <div key={field.id} className="mb-3 p-3 border rounded">
                <Row className="mb-2">
                  <Col>
                    <Form.Control
                    className="form-color"
                      type="text"
                      placeholder="Nombre de la funcionalidad"
                      {...register(`functions.${index}.functionName`, {
                        required: "El nombre de la funcionalidad es obligatorio",
                        minLength: {
                          value: 3,
                          message: "Mínimo 3 caracteres"
                        },
                        maxLength: {
                          value: 50,
                          message: "Máximo 50 caracteres"
                        }
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
                      disabled={isSubmitting}
                    >
                      X
                    </Button>
                  </Col>
                </Row>

                <Form.Control
                className="form-control"
                  as="textarea"
                  rows={2}
                  placeholder="Descripción de la funcionalidad"
                  {...register(`functions.${index}.functionDescription`, {
                    required: "La descripción de la funcionalidad es obligatoria",
                    minLength: {
                      value: 5,
                      message: "Mínimo 5 caracteres"
                    },
                    maxLength: {
                      value: 200,
                      message: "Máximo 200 caracteres"
                    }
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
              disabled={isSubmitting}
            >
              + Agregar funcionalidad
            </Button>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="clientName">
              <Form.Label>
                Cliente <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
              className="form-color"
                {...register("clientName", {
                  required: "Debe seleccionar un cliente",
                  validate: value => value !== "" || "Seleccione un cliente válido"
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

          <Col md={6}>
            <Form.Group controlId="typeProject">
              <Form.Label>
                Tipo de Proyecto <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
              className="form-color"
                {...register("typeProject", {
                  required: "Seleccione un tipo de proyecto",
                  validate: value => value !== "" || "Seleccione un tipo válido"
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

        <Row className="mb-4">
          <Col md={4}>
            <Form.Group controlId="priorityProject">
              <Form.Label>Prioridad <span className="text-danger">*</span></Form.Label>
              <Form.Select
              className="form-color"
                {...register("priorityProject", {
                  required: "Seleccione una prioridad",
                  validate: value => value !== "" || "Seleccione una prioridad válida"
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
              className="form-color"
                type="text"
                placeholder="dd/mm/aaaa"
                {...register("dataEnd", {
                  validate: validateFutureDate
                })}
                isInvalid={!!errors.dataEnd}
              />
              <Form.Control.Feedback type="invalid">
                {errors.dataEnd?.message}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Formato: dd/mm/aaaa (fecha futura)
              </Form.Text>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="budgetProject">
              <Form.Label>Presupuesto Total <span className="text-danger">*</span></Form.Label>
              <Form.Control
               className="form-color form-control"
                type="number"
                step="0.01"
                min="0.01"
                max="100000000"
                {...register("budgetProject", {
                  required: "Ingrese un monto válido",
                  min: {
                    value: 0.01,
                    message: "El presupuesto debe ser mayor a 0"
                  },
                  max: {
                    value: 100000000,
                    message: "El presupuesto no puede exceder los 100,000,000"
                  },
                  valueAsNumber: true
                })}
                isInvalid={!!errors.budgetProject}
              />
              <Form.Control.Feedback type="invalid">
                {errors.budgetProject?.message}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Máximo: 100,000,000
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        {/* BOTONES */}
        <div className="mt-4">
          <Button 
            type="submit" 
            className="me-3 create-btn-custom"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creando..." : "Crear Proyecto"}
          </Button>

          <Button
            variant="light"
            onClick={() => navigate("/projectslist")}
            className="cancel-btn-custom"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateProject;