import { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';

const EMPTY_USUARIO = {
  username: '',
  password: '',
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  telefono: '',
  especialidad: '',
  matricula: '',
};

// Formulario de alta/edición compartido entre pacientes y doctores.
// Usuario y contraseña solo se piden al crear: el backend no los modifica al editar.
export default function UsuarioFormModal({ show, title, usuario, showDoctorFields, onHide, onSubmit }) {
  const isEditing = Boolean(usuario?.id);
  const [formData, setFormData] = useState(EMPTY_USUARIO);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      setFormData({ ...EMPTY_USUARIO, ...usuario, password: '' });
      setError(null);
    }
  }, [show, usuario]);

  const handleChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(formData);
    } catch (submitError) {
      setError(submitError.message || 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={saving ? undefined : onHide} backdrop={saving ? 'static' : true}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton={!saving}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {!isEditing && (
            <Row>
              <Form.Group as={Col} sm={6} className="mb-3" controlId="usuario-username">
                <Form.Label>Usuario *</Form.Label>
                <Form.Control
                  required
                  autoComplete="off"
                  value={formData.username}
                  onChange={handleChange('username')}
                />
              </Form.Group>
              <Form.Group as={Col} sm={6} className="mb-3" controlId="usuario-password">
                <Form.Label>Contraseña *</Form.Label>
                <Form.Control
                  required
                  type="password"
                  autoComplete="new-password"
                  minLength={4}
                  value={formData.password}
                  onChange={handleChange('password')}
                />
              </Form.Group>
            </Row>
          )}

          <Row>
            <Form.Group as={Col} sm={6} className="mb-3" controlId="usuario-nombre">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control required value={formData.nombre} onChange={handleChange('nombre')} />
            </Form.Group>
            <Form.Group as={Col} sm={6} className="mb-3" controlId="usuario-apellido">
              <Form.Label>Apellido *</Form.Label>
              <Form.Control required value={formData.apellido} onChange={handleChange('apellido')} />
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} sm={6} className="mb-3" controlId="usuario-dni">
              <Form.Label>DNI</Form.Label>
              <Form.Control
                inputMode="numeric"
                pattern="[0-9]{7,8}"
                title="7 u 8 dígitos, sin puntos"
                value={formData.dni}
                onChange={handleChange('dni')}
              />
            </Form.Group>
            <Form.Group as={Col} sm={6} className="mb-3" controlId="usuario-telefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="tel" value={formData.telefono} onChange={handleChange('telefono')} />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="usuario-email">
            <Form.Label>Email *</Form.Label>
            <Form.Control required type="email" value={formData.email} onChange={handleChange('email')} />
          </Form.Group>

          {showDoctorFields && (
            <Row>
              <Form.Group as={Col} sm={6} className="mb-3" controlId="usuario-matricula">
                <Form.Label>Matrícula</Form.Label>
                <Form.Control value={formData.matricula} onChange={handleChange('matricula')} />
              </Form.Group>
              <Form.Group as={Col} sm={6} className="mb-3" controlId="usuario-especialidad">
                <Form.Label>Especialidad *</Form.Label>
                <Form.Control
                  required
                  placeholder="Ej: Cardiología"
                  value={formData.especialidad}
                  onChange={handleChange('especialidad')}
                />
              </Form.Group>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? <Spinner size="sm" animation="border" /> : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
