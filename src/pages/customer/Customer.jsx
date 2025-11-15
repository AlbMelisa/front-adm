import React, { useState } from "react";
import {
  Form,
  InputGroup,
  Table,
  Button,
  Badge,
  Card,
} from "react-bootstrap";
import CustomerHistory from "../../components/customerHistory/customerHistory.jsx";
import "./customer.css";

const initialCustomers = [
  { id: 501, nombre: "Tech Solutions Inc.", email: "contact@techsolutions.com", telefono: "+1 234-567-8900", proyectos: 3 },
  { id: 502, nombre: "Digital Innovators", email: "info@digitalinnovators.com", telefono: "+1 234-567-8901", proyectos: 2 },
  { id: 503, nombre: "Global Fitness Co.", email: "hello@globalfitness.com", telefono: "+1 234-567-8902", proyectos: 1 },
  { id: 504, nombre: "Health Systems Ltd.", email: "contact@healthsystems.com", telefono: "+1 234-567-8903", proyectos: 0 },
];

const Customer = () => {
  const [search, setSearch] = useState("");

  // Estados para el modal
  const [showHistory, setShowHistory] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const filtered = initialCustomers.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toString().includes(search)
  );

  // Abrir modal con cliente seleccionado
  const abrirHistorial = (cliente) => {
    setClienteSeleccionado(cliente);
    setShowHistory(true);
  };

  return (
    <div className="customer-container">

      {/* TÍTULO */}
      <h2 className="customer-title">Clientes</h2>

      {/* BUSCADOR */}
      <div className="customer-search-card shadow-sm">
        <Card.Body>
          <InputGroup>
            <InputGroup.Text className="search-icon">🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar cliente por nombre o ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Card.Body>
      </div>

      {/* TABLA: solo aparece si hay búsqueda */}
      {search.trim() !== "" && (
        <div className="customer-table-card shadow-sm mt-4">
          <Card.Body className="p-0">
            <Table hover responsive className="customer-table mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NOMBRE</th>
                  <th>EMAIL</th>
                  <th>TELÉFONO</th>
                  <th>PROYECTOS</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td className="customer-name">{c.nombre}</td>
                      <td>{c.email}</td>
                      <td>{c.telefono}</td>
                      <td>
                        <Badge pill bg="light" text="dark" className="customer-badge">
                          {c.proyectos} proyectos
                        </Badge>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          className="btn-historial"
                          onClick={() => abrirHistorial(c)}
                        >
                          Ver Historial
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-3 text-muted">
                      No se encontraron coincidencias.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </div>
      )}

      {/* MODAL DE HISTORIAL */}
      {clienteSeleccionado && (
        <CustomerHistory
          show={showHistory}
          handleClose={() => setShowHistory(false)}
          cliente={{
            nombreCliente: clienteSeleccionado.nombre,
            proyectos: [
              {
                idProyecto: 1,
                nombreProyecto: "Migración a la Nube V3",
                estadoProyecto: "En Planificación",
              },
              {
                idProyecto: 5,
                nombreProyecto: "Actualización Sistema V2",
                estadoProyecto: "Completado",
              },
              {
                idProyecto: 8,
                nombreProyecto: "Integración API Externa",
                estadoProyecto: "Completado",
              },
            ],
          }}
        />
      )}
    </div>
  );
};

export default Customer;

