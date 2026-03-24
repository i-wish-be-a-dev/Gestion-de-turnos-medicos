import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import turnoService from '../../Services/turnoService';
import doctorService from '../../Services/doctorService';

export default function ReservarTurno() {
  const navigate = useNavigate();
  const [doctores, setDoctores] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    fecha: '',
    hora: '',
    motivo: '',
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctores();
  }, []);

  const fetchDoctores = async () => {
    try {
      const response = await doctorService.getAllDoctores();
      setDoctores(response.data || []);
    } catch (error) {
      console.error('Error fetching doctores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorChange = async (e) => {
    const doctorId = e.target.value;
    setFormData({ ...formData, doctorId, hora: '' });
    
    if (formData.fecha) {
      await fetchHorarios(doctorId, formData.fecha);
    }
  };

  const handleFechaChange = async (e) => {
    const fecha = e.target.value;
    setFormData({ ...formData, fecha, hora: '' });
    
    if (formData.doctorId) {
      await fetchHorarios(formData.doctorId, fecha);
    }
  };

  const fetchHorarios = async (doctorId, fecha) => {
    try {
      const response = await doctorService.getHorariosDisponibles(
        doctorId,
        fecha
      );
      setHorarios(response.data || []);
    } catch (error) {
      setMessage({
        type: 'warning',
        text: 'No hay horarios disponibles para esta fecha',
      });
      setHorarios([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.doctorId || !formData.fecha || !formData.hora || !formData.motivo) {
      setMessage({
        type: 'danger',
        text: 'Todos los campos son requeridos',
      });
      return;
    }

    try {
      await turnoService.createTurno(formData);
      setMessage({
        type: 'success',
        text: 'Turno reservado correctamente',
      });
      setFormData({
        doctorId: '',
        fecha: '',
        hora: '',
        motivo: '',
      });
      setTimeout(() => {
        navigate('/paciente/mis-turnos');
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'danger',
        text: 'Error al reservar el turno',
      });
      console.error('Error:', error);
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="mb-4">Reservar Turno</h1>

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Seleccionar Doctor</Form.Label>
                  <Form.Select
                    value={formData.doctorId}
                    onChange={handleDoctorChange}
                    required
                  >
                    <option value="">-- Seleccione un doctor --</option>
                    {doctores.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.nombre} {doctor.apellido} -
                        {doctor.especialidad}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.fecha}
                    onChange={handleFechaChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Hora</Form.Label>
                  <Form.Select
                    value={formData.hora}
                    onChange={(e) =>
                      setFormData({ ...formData, hora: e.target.value })
                    }
                    disabled={horarios.length === 0}
                    required
                  >
                    <option value="">-- Seleccione una hora --</option>
                    {horarios.map((horario, idx) => (
                      <option key={idx} value={horario}>
                        {horario}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Motivo de la Consulta</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.motivo}
                    onChange={(e) =>
                      setFormData({ ...formData, motivo: e.target.value })
                    }
                    placeholder="Describa brevemente el motivo de su consulta"
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Reservar Turno
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
