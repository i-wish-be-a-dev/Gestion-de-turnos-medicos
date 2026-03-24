import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Alert, Modal, Form } from 'react-bootstrap';
import adminService from '../../Services/adminService';

export default function GestionDoctores() {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    numeroMatricula: '',
    especialidad: '',
  });

  useEffect(() => {
    fetchDoctores();
  }, []);

  const fetchDoctores = async () => {
    try {
      const response = await adminService.getDoctores();
      setDoctores(response.data || []);
    } catch (err) {
      setError('Error al cargar doctores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData(doctor);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este doctor?')) {
      try {
        await adminService.deleteDoctor(id);
        fetchDoctores();
      } catch (err) {
        console.error('Error al eliminar:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await adminService.updateDoctor(editingDoctor.id, formData);
      } else {
        await adminService.createDoctor(formData);
      }
      setShowModal(false);
      fetchDoctores();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Doctores</h1>
        <Button href="/admin/doctores/nuevo" variant="success">
          + Nuevo Doctor
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Matrícula</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Especialidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {doctores.map((doctor, index) => (
            <tr key={buildDoctorKey(doctor, index)}>
              <td>{doctor.numeroMatricula}</td>
              <td>{doctor.nombre}</td>
              <td>{doctor.apellido}</td>
              <td>{doctor.email}</td>
              <td>{doctor.especialidad}</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => handleEdit(doctor)}
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(doctor.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingDoctor ? 'Editar Doctor' : 'Nuevo Doctor'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Matrícula</Form.Label>
              <Form.Control
                type="text"
                value={formData.numeroMatricula}
                onChange={(e) =>
                  setFormData({ ...formData, numeroMatricula: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Especialidad</Form.Label>
              <Form.Control
                type="text"
                value={formData.especialidad}
                onChange={(e) =>
                  setFormData({ ...formData, especialidad: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

function buildDoctorKey(doctor, index) {
  return doctor.id || doctor.numeroMatricula || doctor.email || `doctor-${index}`;
}
