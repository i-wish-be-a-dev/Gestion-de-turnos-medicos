import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import '../../Styles/Dashboard.css';
import turnoService from '../../Services/turnoService';
import doctorService from '../../Services/doctorService';

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [doctorData, turnosData] = await Promise.all([
        doctorService.getDoctorActual(),
        turnoService.getTurnosUsario(),
      ]);
      
      setDoctor(doctorData.data);
      setTurnos(turnosData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const turnosHoy = turnos.filter(
    (t) => new Date(t.fecha).toDateString() === new Date().toDateString()
  );

  const turnosPendientes = turnos.filter((t) => t.estado === 'PENDIENTE');

  if (loading) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Dashboard Doctor</h1>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5>Información del Doctor</h5>
              <p>
                <strong>Nombre:</strong> {doctor?.nombre} {doctor?.apellido}
              </p>
              <p>
                <strong>Email:</strong> {doctor?.email}
              </p>
              <p>
                <strong>Especialidad:</strong> {doctor?.especialidad}
              </p>
              <p>
                <strong>Matrícula:</strong> {doctor?.numeroMatricula}
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
                <strong>Turnos Hoy:</strong> {turnosHoy.length}
              </p>
              <p>
                <strong>Pendientes:</strong> {turnosPendientes.length}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5>Mis Turnos</h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Paciente</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {turnos.length > 0 ? (
                turnos.map((turno) => (
                  <tr key={turno.id}>
                    <td>{new Date(turno.fecha).toLocaleDateString()}</td>
                    <td>{turno.hora}</td>
                    <td>{turno.paciente?.nombre} {turno.paciente?.apellido}</td>
                    <td>
                      <span className={`badge bg-${getStatusColor(turno.estado)}`}>
                        {turno.estado}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No hay turnos
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
