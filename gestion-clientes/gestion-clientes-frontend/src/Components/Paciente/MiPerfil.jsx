import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import pacienteService from '../../Services/pacienteService';

export default function MiPerfil() {
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchPacienteData();
  }, []);

  const fetchPacienteData = async () => {
    try {
      const response = await pacienteService.getPacienteActual();
      setPaciente(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching paciente data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await pacienteService.updatePerfil(formData);
      setMessage({
        type: 'success',
        text: 'Perfil actualizado correctamente',
      });
      setEditing(false);
      fetchPacienteData();
    } catch (error) {
      setMessage({
        type: 'danger',
        text: 'Error al actualizar el perfil',
      });
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
                <strong>Nombre:</strong> {paciente?.nombre}
              </p>
              <p>
                <strong>Apellido:</strong> {paciente?.apellido}
              </p>
              <p>
                <strong>Email:</strong> {paciente?.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {paciente?.telefono}
              </p>
              <p>
                <strong>DNI:</strong> {paciente?.dni}
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
              <Form.Group className="mb-3">
                <Form.Label>DNI</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.dni || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, dni: e.target.value })
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
                    setFormData(paciente);
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
