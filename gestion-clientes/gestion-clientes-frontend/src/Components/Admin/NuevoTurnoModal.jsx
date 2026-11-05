import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import adminService, { displayName } from '../../Services/adminService';

// Turnos de 30 minutos entre las 08:00 y las 19:30
const SLOTS = Array.from({ length: 24 }, (_, index) => {
  const minutes = 8 * 60 + index * 30;
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
});
const TURNO_MS = 30 * 60 * 1000;

const EMPTY_FORM = { especialidad: '', idMedico: '', idPaciente: '', fecha: '', hora: '' };

export default function NuevoTurnoModal({ show, onHide, onCreated, doctores, pacientes, turnos }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      setForm(EMPTY_FORM);
      setError(null);
    }
  }, [show]);

  const especialidades = useMemo(
    () => [...new Set(doctores.map((doctor) => doctor.especialidad).filter(Boolean))].sort(),
    [doctores]
  );

  const doctoresFiltrados = form.especialidad
    ? doctores.filter((doctor) => doctor.especialidad === form.especialidad)
    : doctores;

  // Horarios del día elegido que chocan con un turno activo del médico o del paciente
  const ocupados = useMemo(() => {
    if (!form.fecha) {
      return {};
    }
    const result = {};
    const activos = turnos.filter((turno) => turno.estado !== 'ELIMINADO' && turno.fecha);
    SLOTS.forEach((slot) => {
      const slotDate = new Date(`${form.fecha}T${slot}:00`);
      const choca = (turno) => Math.abs(turno.fecha - slotDate) < TURNO_MS;
      if (form.idMedico && activos.some((turno) => String(turno.medico?.id) === form.idMedico && choca(turno))) {
        result[slot] = 'médico ocupado';
      } else if (form.idPaciente && activos.some((turno) => String(turno.paciente?.id) === form.idPaciente && choca(turno))) {
        result[slot] = 'paciente ocupado';
      } else if (slotDate < new Date()) {
        result[slot] = 'pasado';
      }
    });
    return result;
  }, [form.fecha, form.idMedico, form.idPaciente, turnos]);

  const setField = (field) => (event) => {
    const value = event.target.value;
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === 'especialidad' && value && doctores.find((d) => String(d.id) === current.idMedico)?.especialidad !== value) {
        next.idMedico = '';
      }
      return next;
    });
  };

  // si al cambiar médico/paciente/fecha el horario elegido queda ocupado, se descarta
  useEffect(() => {
    if (form.hora && ocupados[form.hora]) {
      setForm((current) => ({ ...current, hora: '' }));
    }
  }, [ocupados, form.hora]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await adminService.asignarTurno(form.idPaciente, form.idMedico, `${form.fecha}T${form.hora}:00`);
      onCreated();
    } catch (submitError) {
      setError(submitError.message || 'No se pudo asignar el turno.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={saving ? undefined : onHide} backdrop={saving ? 'static' : true}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton={!saving}>
          <Modal.Title>Nuevo Turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {(doctores.length === 0 || pacientes.length === 0) && (
            <Alert variant="warning">
              Para asignar un turno necesitás al menos un doctor y un paciente cargados.
            </Alert>
          )}

          <Form.Group className="mb-3" controlId="turno-paciente">
            <Form.Label>Paciente *</Form.Label>
            <Form.Select required value={form.idPaciente} onChange={setField('idPaciente')}>
              <option value="">Seleccionar paciente</option>
              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {displayName(paciente)}{paciente.dni ? ` — DNI ${paciente.dni}` : ''}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Row>
            <Form.Group as={Col} sm={5} className="mb-3" controlId="turno-especialidad">
              <Form.Label>Especialidad</Form.Label>
              <Form.Select value={form.especialidad} onChange={setField('especialidad')}>
                <option value="">Todas</option>
                {especialidades.map((especialidad) => (
                  <option key={especialidad} value={especialidad}>{especialidad}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} sm={7} className="mb-3" controlId="turno-medico">
              <Form.Label>Médico *</Form.Label>
              <Form.Select required value={form.idMedico} onChange={setField('idMedico')}>
                <option value="">Seleccionar médico</option>
                {doctoresFiltrados.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {displayName(doctor)}{doctor.especialidad ? ` — ${doctor.especialidad}` : ''}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} sm={6} className="mb-3" controlId="turno-fecha">
              <Form.Label>Fecha *</Form.Label>
              <Form.Control required type="date" min={toDateInput(new Date())} value={form.fecha} onChange={setField('fecha')} />
            </Form.Group>
            <Form.Group as={Col} sm={6} className="mb-3" controlId="turno-hora">
              <Form.Label>Hora *</Form.Label>
              <Form.Select required disabled={!form.fecha} value={form.hora} onChange={setField('hora')}>
                <option value="">{form.fecha ? 'Seleccionar hora' : 'Elegí una fecha'}</option>
                {SLOTS.map((slot) => (
                  <option key={slot} value={slot} disabled={Boolean(ocupados[slot])}>
                    {slot}{ocupados[slot] ? ` (${ocupados[slot]})` : ''}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? <Spinner size="sm" animation="border" /> : 'Asignar turno'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

function pad(value) {
  return String(value).padStart(2, '0');
}

// yyyy-MM-dd en hora local (toISOString usaría UTC y puede correr el día)
function toDateInput(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
