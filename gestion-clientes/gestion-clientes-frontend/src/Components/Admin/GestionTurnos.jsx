import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Nav, Row, Spinner, Table } from 'react-bootstrap';
import adminService, { TURNO_STATES, displayName } from '../../Services/adminService';
import NuevoTurnoModal from './NuevoTurnoModal';

const ESTADO_TABS = ['', 'PENDIENTE', 'VIGENTE', 'FINALIZADO', 'ELIMINADO'];

export default function GestionTurnos() {
  const [turnos, setTurnos] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [filters, setFilters] = useState({ estado: '', especialidad: '', idMedico: '', idPaciente: '', soloProximos: false });

  const loadData = useCallback(async () => {
    try {
      const [turnosData, doctoresData, pacientesData] = await Promise.all([
        adminService.getTurnos(),
        adminService.getDoctores(),
        adminService.getPacientes(),
      ]);
      setTurnos(turnosData);
      setDoctores(doctoresData);
      setPacientes(pacientesData);
    } catch (error) {
      setMessage({ type: 'danger', text: error.message || 'No se pudieron cargar los turnos.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const especialidades = useMemo(
    () => [...new Set(doctores.map((doctor) => doctor.especialidad).filter(Boolean))].sort(),
    [doctores]
  );

  // Filtra por todo menos el estado, así los contadores de las pestañas reflejan los demás filtros
  const turnosSinFiltroEstado = useMemo(() => {
    const ahora = new Date();
    return turnos
      .filter((turno) => !filters.especialidad || turno.medico?.especialidad === filters.especialidad)
      .filter((turno) => !filters.idMedico || String(turno.medico?.id) === filters.idMedico)
      .filter((turno) => !filters.idPaciente || String(turno.paciente?.id) === filters.idPaciente)
      .filter((turno) => !filters.soloProximos || (turno.fecha && turno.fecha >= ahora))
      .sort((a, b) => (a.fecha ?? 0) - (b.fecha ?? 0));
  }, [turnos, filters.especialidad, filters.idMedico, filters.idPaciente, filters.soloProximos]);

  const turnosFiltrados = filters.estado
    ? turnosSinFiltroEstado.filter((turno) => turno.estado === filters.estado)
    : turnosSinFiltroEstado;

  const countByEstado = (estado) =>
    estado ? turnosSinFiltroEstado.filter((turno) => turno.estado === estado).length : turnosSinFiltroEstado.length;

  const setFilter = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const hasFilters = filters.especialidad || filters.idMedico || filters.idPaciente || filters.soloProximos;

  const runAction = async (turno, action, confirmText, successText) => {
    if (confirmText && !window.confirm(confirmText)) {
      return;
    }
    setBusyId(turno.id);
    try {
      await action(turno.id);
      setMessage({ type: 'success', text: successText });
      setTurnos(await adminService.getTurnos());
    } catch (error) {
      setMessage({ type: 'danger', text: error.message });
    } finally {
      setBusyId(null);
    }
  };

  const handleCreated = async () => {
    setShowModal(false);
    setMessage({ type: 'success', text: 'Turno asignado correctamente.' });
    setTurnos(await adminService.getTurnos());
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="mt-5">
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Gestión de Turnos</h1>
        <Button variant="success" onClick={() => setShowModal(true)}>
          + Nuevo Turno
        </Button>
      </div>

      {message && (
        <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Card className="mb-3">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={3}>
              <Form.Group controlId="filtro-especialidad">
                <Form.Label>Especialidad</Form.Label>
                <Form.Select value={filters.especialidad} onChange={setFilter('especialidad')}>
                  <option value="">Todas</option>
                  {especialidades.map((especialidad) => (
                    <option key={especialidad} value={especialidad}>{especialidad}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="filtro-medico">
                <Form.Label>Médico</Form.Label>
                <Form.Select value={filters.idMedico} onChange={setFilter('idMedico')}>
                  <option value="">Todos</option>
                  {doctores.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>{displayName(doctor)}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="filtro-paciente">
                <Form.Label>Paciente</Form.Label>
                <Form.Select value={filters.idPaciente} onChange={setFilter('idPaciente')}>
                  <option value="">Todos</option>
                  {pacientes.map((paciente) => (
                    <option key={paciente.id} value={paciente.id}>{displayName(paciente)}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex flex-wrap gap-3 align-items-center">
              <Form.Check
                id="filtro-proximos"
                type="switch"
                label="Solo próximos"
                checked={filters.soloProximos}
                onChange={setFilter('soloProximos')}
              />
              {hasFilters && (
                <Button
                  size="sm"
                  variant="link"
                  className="p-0"
                  onClick={() => setFilters((current) => ({ ...current, especialidad: '', idMedico: '', idPaciente: '', soloProximos: false }))}
                >
                  Limpiar filtros
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Nav variant="tabs" activeKey={filters.estado} onSelect={(key) => setFilters((current) => ({ ...current, estado: key ?? '' }))}>
        {ESTADO_TABS.map((estado) => (
          <Nav.Item key={estado || 'todos'}>
            <Nav.Link eventKey={estado}>
              {estado ? TURNO_STATES[estado].label : 'Todos'}{' '}
              <Badge bg={estado ? TURNO_STATES[estado].variant : 'secondary'} pill>{countByEstado(estado)}</Badge>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Table striped bordered hover responsive className="mt-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Médico</th>
            <th>Paciente</th>
            <th>Estado</th>
            <th style={{ width: 200 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnosFiltrados.length > 0 ? (
            turnosFiltrados.map((turno) => (
              <tr key={turno.id}>
                <td>{turno.id}</td>
                <td>{formatDate(turno.fecha)}</td>
                <td>{formatTime(turno.fecha)}</td>
                <td>
                  {displayName(turno.medico)}
                  {turno.medico?.especialidad && (
                    <div className="small text-muted">{turno.medico.especialidad}</div>
                  )}
                </td>
                <td>{displayName(turno.paciente)}</td>
                <td>
                  <Badge bg={TURNO_STATES[turno.estado]?.variant || 'secondary'}>
                    {TURNO_STATES[turno.estado]?.label || turno.estado}
                  </Badge>
                </td>
                <td>
                  <TurnoActions turno={turno} busy={busyId === turno.id} onAction={runAction} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                {turnos.length === 0 ? 'No hay turnos registrados.' : 'Ningún turno coincide con los filtros.'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <NuevoTurnoModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onCreated={handleCreated}
        doctores={doctores}
        pacientes={pacientes}
        turnos={turnos}
      />
    </Container>
  );
}

function TurnoActions({ turno, busy, onAction }) {
  if (busy) {
    return <Spinner size="sm" animation="border" />;
  }

  const descripcion = `el turno #${turno.id} (${formatDate(turno.fecha)} ${formatTime(turno.fecha)})`;
  // un turno solo puede finalizarse una vez que empezó
  const yaEmpezo = turno.fecha && turno.fecha <= new Date();

  return (
    <div className="d-flex flex-wrap gap-1">
      {turno.estado === 'PENDIENTE' && (
        <Button
          size="sm"
          variant="success"
          onClick={() => onAction(turno, adminService.confirmarTurno, null, `Turno #${turno.id} confirmado.`)}
        >
          Confirmar
        </Button>
      )}
      {turno.estado === 'VIGENTE' && (
        <Button
          size="sm"
          variant="info"
          disabled={!yaEmpezo}
          title={yaEmpezo ? undefined : 'Disponible cuando llegue la fecha del turno'}
          onClick={() => onAction(turno, adminService.finalizarTurno, `¿Marcar como finalizado ${descripcion}?`, `Turno #${turno.id} finalizado.`)}
        >
          Finalizar
        </Button>
      )}
      {(turno.estado === 'PENDIENTE' || turno.estado === 'VIGENTE') && (
        <Button
          size="sm"
          variant="outline-danger"
          onClick={() => onAction(turno, adminService.cancelarTurno, `¿Cancelar ${descripcion}?`, `Turno #${turno.id} cancelado.`)}
        >
          Cancelar
        </Button>
      )}
    </div>
  );
}

function formatDate(fecha) {
  return fecha && !Number.isNaN(fecha.getTime()) ? fecha.toLocaleDateString('es-AR') : '-';
}

function formatTime(fecha) {
  return fecha && !Number.isNaN(fecha.getTime())
    ? fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    : '-';
}
