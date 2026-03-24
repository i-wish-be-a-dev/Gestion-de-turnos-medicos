import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import '../../Styles/Dashboard.css';
import turnoService from '../../Services/turnoService';
import pacienteService from '../../Services/pacienteService';

export default function PacienteDashboard() {
  const [paciente, setPaciente] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pacienteData, turnosData] = await Promise.all([
        pacienteService.getPacienteActual(),
        turnoService.getTurnosUsario(),
      ]);

      setPaciente(pacienteData.data);
      setTurnos(turnosData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const turnosProximos = turnos.filter(
    (t) => new Date(t.fecha) > new Date()
  );

  const turnosCompletados = turnos.filter((t) => t.estado === 'COMPLETADO');

  if (loading) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Dashboard Paciente</h1>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5>Información Personal</h5>
              <p>
                <strong>Nombre:</strong> {paciente?.nombre} {paciente?.apellido}
              </p>
              <p>
                <strong>Email:</strong> {paciente?.email}
              </p>
              <p>
                <strong>DNI:</strong> {paciente?.dni}
              </p>
              <p>
                <strong>Teléfono:</strong> {paciente?.telefono}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5>Estadísticas</h5>
              <p>
                <strong>Turnos Totales:</strong> {turnos.length}
              </p>
              <p>
                <strong>Próximos Turnos:</strong> {turnosProximos.length}
              </p>
              <p>
                <strong>Completados:</strong> {turnosCompletados.length}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5>Próximos Turnos</h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Doctor</th>
                <th>Especialidad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {turnosProximos.length > 0 ? (
                turnosProximos.map((turno) => (
                  <tr key={turno.id}>
                    <td>{new Date(turno.fecha).toLocaleDateString()}</td>
                    <td>{turno.hora}</td>
                    <td>{turno.doctor?.nombre} {turno.doctor?.apellido}</td>
                    <td>{turno.doctor?.especialidad}</td>
                    <td>
                      <span className={`badge bg-${getStatusColor(turno.estado)}`}>
                        {turno.estado}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay próximos turnos
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

function getStatusColor(estado) {
  const colors = {
    PENDIENTE: 'warning',
    CONFIRMADO: 'info',
    COMPLETADO: 'success',
    CANCELADO: 'danger',
  };
  return colors[estado] || 'secondary';
}
