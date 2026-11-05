import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import doctorService from '../../Services/doctorService';

export default function MiPerfil() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const response = await doctorService.getDoctorActual();
      setDoctor(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await doctorService.updatePerfil(formData);
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      setEditing(false);
      fetchDoctorData();
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error al actualizar el perfil' });
      console.error('Error:', error);
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Mi Perfil</h1>

      {message && <Alert variant={message.type}>{message.text}</Alert>}

      <Card>
        <Card.Body>
          {!editing ? (
            <>
              <p>
                <strong>Nombre:</strong> {doctor?.nombre}
              </p>
              <p>
                <strong>Apellido:</strong> {doctor?.apellido}
              </p>
              <p>
                <strong>Email:</strong> {doctor?.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {doctor?.telefono}
              </p>
              <p>
                <strong>Especialidad:</strong> {doctor?.especialidad}
              </p>
              <p>
                <strong>Matrícula:</strong> {doctor?.numeroMatricula}
              </p>
              <Button
                variant="primary"
                onClick={() => setEditing(true)}
              >
                Editar Perfil
              </Button>
            </>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.nombre || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.apellido || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, apellido: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  value={formData.telefono || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                />
              </Form.Group>
              <div>
                <Button
                  variant="success"
                  type="submit"
                  className="me-2"
                >
                  Guardar
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditing(false);
                    setFormData(doctor);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
