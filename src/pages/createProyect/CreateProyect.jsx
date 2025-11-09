import { Form, Row, Col, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../createProyect/createProyect.css";

const defaultValues = {
  nombreProyecto: "",
  responsable: "",
  descripcion: "",
  tipoProyecto: "",
  cliente: "",
  fechaInicio: "",
  fechaFin: "",
  presupuestoTotal: "0.00",
};

const CreateProyect = (values = defaultValues) => {
  const responsablesList = [
  { id: 1, nombre: 'Juan Pérez' },
  { id: 2, nombre: 'Ana García' },
  { id: 3, nombre: 'Luis Fernández' },
];
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: values, // Mantenemos el '0.00' inicial
    mode: "all",
  });
  const onSubmit = async (values) => {
    const endpoint = "http://localhost:3001/proyectos";
    const method = "POST";

    try {
      const body = JSON.stringify(values);
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        let errorMessage = `Error del servidor al crear el proyecto: ${response.status}`;

        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Si la respuesta fallida no tiene cuerpo JSON
        }
        throw new Error(errorMessage);
      }

      // 3. Manejo de éxito
      const newProjectData = await response.json(); // La API podría devolver el ID del nuevo proyecto

      alert("¡Proyecto creado exitosamente!");

      // Aquí debes usar el hook 'navigate'
      navigate("/proyectslist");

      // Opcional: Si quieres redirigir a la página de detalle del nuevo proyecto
      // navigate(`/proyectslist/${newProjectData.idProyecto}`);
    } catch (error) {
      // Muestra el error de red O el error del servidor que lanzamos
      alert("Error al intentar crear el proyecto: " + error.message);
    }
  };

  return (
    <Container className="p-4 my-5 bg-white shadow-lg rounded-3 form-card-custom">
      <h2 className="mb-4 form-title-custom">Información del Proyecto</h2>

      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="nombreProyecto">
              <Form.Label>
                Nombre del Proyecto <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                {...register("nombreProyecto", {
                  required: "El nombre del proyecto es obligatorio.",
                  pattern: {
                    // RegEx que permite SOLO letras y espacios (incluyendo tildes/ñ)
                    value: /^[A-Za-zÀ-ÿ0-9\s]+$/,
                    message: "El nombre solo puede contener letras y espacios.",
                  },
                })}
                type="text"
                placeholder="Ingrese el nombre del proyecto"
                // 6. INDICAMOS EL ESTADO DE ERROR con el objeto 'errors'
                isInvalid={!!errors.nombreProyecto}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nombreProyecto?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="responsable">
              <Form.Label>
                Equipo <span className="text-danger">*</span>
              </Form.Label>

              {/* === CAMBIO PRINCIPAL AQUÍ === */}
              <Form.Select
                // 5. USAMOS REGISTER (igual que antes)
                {...register("responsable", {
                  required: "Debe seleccionar un responsable.", // Mensaje actualizado
                })}
                isInvalid={!!errors.responsable}
                // defaultValue="" // Opcional: si quieres que inicie en el placeholder
              >
                {/* Opción deshabilitada que actúa como placeholder */}
                <option value="" disabled selected>
                  Seleccione un responsable...
                </option>

                {/* Mapeamos la lista de responsables para crear las opciones.
        'value' será el ID que se guarde en el formulario.
      */}
                {responsablesList.map((responsable) => (
                  <option key={responsable.id} value={responsable.id}>
                    {responsable.nombre}
                  </option>
                ))}
              </Form.Select>

              {/* El Feedback de error funciona igual */}
              <Form.Control.Feedback type="invalid">
                {errors.responsable?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Segunda Fila: Descripción */}
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="descripcion">
              <Form.Label>
                Descripción <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describa el proyecto"
                // 5. USAMOS REGISTER
                {...register("descripcion", {
                  required: "La descripción es obligatoria.",
                  minLength: {
                    value: 10,
                    message:
                      "La descripción debe tener al menos 10 caracteres.",
                  },
                })}
                isInvalid={!!errors.descripcion}
              />
              <Form.Control.Feedback type="invalid">
                {errors.descripcion?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Tercera Fila: Tipo de Proyecto y Cliente (Selects) */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="tipoProyecto">
              <Form.Label>
                Tipo de Proyecto <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                // 5. USAMOS REGISTER
                {...register("tipoProyecto", {
                  validate: (value) =>
                    value !== "" || "Debe seleccionar un tipo de proyecto.",
                })}
                isInvalid={!!errors.tipoProyecto}
              >
                <option value="">Seleccione el tipo</option>
                <option value="desarrollo">Desarrollo</option>
                <option value="marketing">Marketing</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.tipoProyecto?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="cliente">
              <Form.Label>
                Cliente <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                // 5. USAMOS REGISTER
                {...register("cliente", {
                  validate: (value) =>
                    value !== "" || "Debe seleccionar un cliente.",
                })}
                isInvalid={!!errors.cliente}
              >
                <option value="">Seleccione el cliente</option>
                <option value="clienteA">Cliente A</option>
                <option value="clienteB">Cliente B</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.cliente?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Cuarta Fila: Fechas y Presupuesto */}
        <Row className="mb-4">
          {/* Campo Fecha Inicio */}
          <Col md={4}>
            <Form.Group controlId="fechaInicio">
              <Form.Label>
                Fecha de Inicio <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-with-icon-bootstrap">
                <Form.Control
                  type="text"
                  placeholder="dd/mm/aaaa"
                  // 5. USAMOS REGISTER
                  {...register("fechaInicio", {
                    required: "La fecha de inicio es obligatoria.",
                    // Ejemplo de pattern para formato dd/mm/aaaa (básico)
                    pattern: {
                      value: /^\d{2}\/\d{2}\/\d{4}$/,
                      message:
                        "Formato de fecha inválido (debe ser dd/mm/aaaa).",
                    },
                  })}
                  isInvalid={!!errors.fechaInicio}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fechaInicio?.message}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
          </Col>

          {/* Campo Fecha Fin */}
          <Col md={4}>
            <Form.Group controlId="fechaFin">
              <Form.Label>
                Fecha de Fin <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-with-icon-bootstrap">
                <Form.Control
                  type="text"
                  placeholder="dd/mm/aaaa"
                  icon="📅"
                  // 5. USAMOS REGISTER
                  {...register("fechaFin", {
                    required: "La fecha de fin es obligatoria.",
                    pattern: {
                      value: /^\d{2}\/\d{2}\/\d{4}$/,
                      message:
                        "Formato de fecha inválido (debe ser dd/mm/aaaa).",
                    },
                  })}
                  isInvalid={!!errors.fechaFin}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fechaFin?.message}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
          </Col>

          {/* Campo Presupuesto Total */}
          <Col md={4}>
            <Form.Group controlId="presupuestoTotal">
              <Form.Label>
                Presupuesto Total <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                // 5. USAMOS REGISTER
                {...register("presupuestoTotal", {
                  required: "El presupuesto es obligatorio.",
                  min: {
                    value: 0.01,
                    message: "El presupuesto debe ser mayor a cero.",
                  },
                })}
                isInvalid={!!errors.presupuestoTotal}
              />
              <Form.Control.Feedback type="invalid">
                {errors.presupuestoTotal?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Botones */}
        <div className="mt-4">
          <Button type="submit" className="me-3 create-btn-custom">
            Crear Proyecto
          </Button>
          <Button
            variant="light"
            type="button"
            className="cancel-btn-custom"
            onClick={() => navigate("/proyectslist")}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateProyect;
