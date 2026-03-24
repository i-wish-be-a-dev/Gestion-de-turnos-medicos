import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Badge, Button, Container, Table } from 'react-bootstrap';
import adminService from '../../Services/adminService';
import turnoService from '../../Services/turnoService';

const ROLE_CONFIG = {
  ADMIN: {
    title: 'Listado de Turnos',
    emptyMessage: 'No hay turnos registrados',
    columns: ['ID', 'Fecha', 'Hora', 'Médico', 'Paciente', 'Estado'],
  },
  DOCTOR: {
    title: 'Mis Turnos',
    emptyMessage: 'No hay turnos registrados',
    columns: ['Fecha', 'Hora', 'Paciente', 'Motivo', 'Estado', 'Acciones'],
  },
  PACIENTE: {
    title: 'Mis Turnos',
    emptyMessage: 'No hay turnos registrados',
    columns: ['Fecha', 'Hora', 'Doctor', 'Especialidad', 'Motivo', 'Estado', 'Acciones'],
    showReserveButton: true,
  },
};

export default function TurnosList({ role: roleProp }) {
  const role = (roleProp || localStorage.getItem('role') || '').toUpperCase();
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const config = ROLE_CONFIG[role];

  useEffect(() => {
    if (!config) {
      setLoading(false);
      setMessage({ type: 'danger', text: 'No se pudo identificar el rol para cargar los turnos.' });
      return;
    }

    fetchTurnos();
  }, [role]);

  const fetchTurnos = async () => {
    setLoading(true);
    try {
      const response = role === 'ADMIN'
        ? await adminService.getTurnos()
        : await turnoService.getTurnosByRole(role);
      setTurnos((response.data || []).map(normalizeTurno));
      setMessage(null);
    } catch (error) {
      console.error('Error fetching turnos:', error);
      setMessage({ type: 'danger', text: 'No se pudieron cargar los turnos.' });
      setTurnos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (turnoId, newStatus) => {
    try {
      await turnoService.cambiarEstadoTurno(turnoId, newStatus);
      setMessage({ type: 'success', text: 'El turno se actualizó correctamente.' });
      fetchTurnos();
    } catch (error) {
      console.error('Error updating turno:', error);
      setMessage({ type: 'danger', text: 'No se pudo actualizar el turno.' });
    }
  };

  const handleCancel = async (turnoId) => {
    if (!window.confirm('¿Está seguro de que desea cancelar este turno?')) {
      return;
    }

    await handleStatusChange(turnoId, 'CANCELADO');
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  if (!config) {
    return (
      <Container className="mt-5">
        {message && <Alert variant={message.type}>{message.text}</Alert>}
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h1 className="mb-4">{config.title}</h1>

      {message && <Alert variant={message.type}>{message.text}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {config.columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {turnos.length > 0 ? (
            turnos.map((turno) => (
              <tr key={turno.id}>
                {renderCellsByRole(role, turno)}
                {renderActionsByRole(role, turno, handleStatusChange, handleCancel)}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={config.columns.length} className="text-center">
                {config.emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {config.showReserveButton && (
        <div className="mt-3">
          <Button as={Link} to="/paciente/reservar-turno" variant="primary">
            Reservar Nuevo Turno
          </Button>
        </div>
      )}
    </Container>
  );
}

function renderCellsByRole(role, turno) {
  const commonCells = [
    <td key="fecha">{formatDate(turno.fecha)}</td>,
    <td key="hora">{turno.hora}</td>,
  ];

  if (role === 'ADMIN') {
    return [
      <td key="id">{turno.id}</td>,
      ...commonCells,
      <td key="doctor">{turno.doctor?.displayName}</td>,
      <td key="paciente">{turno.paciente?.displayName}</td>,
      <td key="estado"><Badge bg={getStatusColor(turno.estado)}>{turno.estado}</Badge></td>,
    ];
  }

  if (role === 'DOCTOR') {
    return [
      ...commonCells,
      <td key="paciente">{turno.paciente?.displayName}</td>,
      <td key="motivo">{turno.motivo}</td>,
      <td key="estado"><Badge bg={getStatusColor(turno.estado)}>{turno.estado}</Badge></td>,
    ];
  }

  return [
    ...commonCells,
    <td key="doctor">{turno.doctor?.displayName}</td>,
    <td key="especialidad">{turno.doctor?.especialidad}</td>,
    <td key="motivo">{turno.motivo}</td>,
    <td key="estado"><Badge bg={getStatusColor(turno.estado)}>{turno.estado}</Badge></td>,
  ];
}

function renderActionsByRole(role, turno, onStatusChange, onCancel) {
  if (role === 'DOCTOR') {
    return (
      <td>
        {turno.estado === 'PENDIENTE' && (
          <>
            <Button
              size="sm"
              variant="success"
              className="me-2"
              onClick={() => onStatusChange(turno.id, 'CONFIRMADO')}
            >
              Confirmar
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onCancel(turno.id)}
            >
              Cancelar
            </Button>
          </>
        )}
        {turno.estado === 'CONFIRMADO' && (
          <Button
            size="sm"
            variant="info"
            onClick={() => onStatusChange(turno.id, 'COMPLETADO')}
          >
            Completar
          </Button>
        )}
      </td>
    );
  }

  if (role === 'PACIENTE') {
    const canCancel =
      (turno.estado === 'PENDIENTE' || turno.estado === 'CONFIRMADO') &&
      getTurnoDate(turno.fecha) > new Date();

    return (
      <td>
        {canCancel && (
          <Button
            size="sm"
            variant="danger"
            onClick={() => onCancel(turno.id)}
          >
            Cancelar
          </Button>
        )}
      </td>
    );
  }

  return null;
}

function getStatusColor(estado) {
  const colors = {
    VIGENTE: 'primary',
    PENDIENTE: 'warning',
    CONFIRMADO: 'info',
    COMPLETADO: 'success',
    CANCELADO: 'danger',
  };

  return colors[estado] || 'secondary';
}

function normalizeTurno(turno) {
  const fecha = turno.fecha || turno.fechaTurno || turno.fechaHora || null;

  return {
    ...turno,
    fecha,
    hora: turno.hora || formatTime(fecha),
    motivo: turno.motivo || turno.motivoConsulta || turno.descripcion || '-',
    estado: turno.estado || turno.estadoTurno || turno.turnoState || '-',
    doctor: normalizePersona(turno.doctor || turno.medico),
    paciente: normalizePersona(turno.paciente),
  };
}

function normalizePersona(persona) {
  if (!persona) {
    return {
      displayName: '-',
      especialidad: '-',
    };
  }

  const displayName =
    persona.nombreCompleto ||
    [persona.nombre, persona.apellido].filter(Boolean).join(' ') ||
    persona.username ||
    persona.email ||
    '-';

  return {
    ...persona,
    displayName,
    especialidad: persona.especialidad || persona.especialidadNombre || '-',
  };
}

function formatDate(fecha) {
  const turnoDate = getTurnoDate(fecha);
  if (Number.isNaN(turnoDate.getTime())) {
    return '-';
  }

  return turnoDate.toLocaleDateString();
}

function formatTime(fecha) {
  const turnoDate = getTurnoDate(fecha);
  if (Number.isNaN(turnoDate.getTime())) {
    return '-';
  }

  return turnoDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getTurnoDate(fecha) {
  return new Date(fecha);
}