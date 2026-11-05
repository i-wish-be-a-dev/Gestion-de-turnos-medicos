import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Container, Form, InputGroup, Spinner, Table } from 'react-bootstrap';
import adminService from '../../Services/adminService';
import UsuarioFormModal from './UsuarioFormModal';

// Listado + alta/edición/baja de usuarios de un rol (pacientes o doctores).
// columns: [{ key, label, render? }]
export default function UsuariosCrud({ title, entityLabel, fetchUsuarios, createUsuario, columns, showDoctorFields }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState('');
  const [modalUsuario, setModalUsuario] = useState(null);

  const loadUsuarios = useCallback(async () => {
    try {
      setUsuarios(await fetchUsuarios());
    } catch (error) {
      setMessage({ type: 'danger', text: error.message || `No se pudieron cargar los ${entityLabel.plural}.` });
    } finally {
      setLoading(false);
    }
  }, [fetchUsuarios, entityLabel.plural]);

  useEffect(() => {
    loadUsuarios();
  }, [loadUsuarios]);

  const filteredUsuarios = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return usuarios;
    }
    return usuarios.filter((usuario) =>
      [usuario.username, usuario.nombre, usuario.apellido, usuario.dni, usuario.email, usuario.especialidad, usuario.matricula]
        .some((value) => value?.toLowerCase().includes(term))
    );
  }, [usuarios, search]);

  const handleSubmit = async (formData) => {
    if (modalUsuario?.id) {
      await adminService.updateUsuario(modalUsuario.id, formData);
      setMessage({ type: 'success', text: `${entityLabel.singular} actualizado correctamente.` });
    } else {
      await createUsuario(formData);
      setMessage({ type: 'success', text: `${entityLabel.singular} creado correctamente.` });
    }
    setModalUsuario(null);
    await loadUsuarios();
  };

  const handleDelete = async (usuario) => {
    if (!window.confirm(`¿Eliminar a ${usuario.nombreCompleto || usuario.username}? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await adminService.deleteUsuario(usuario.id);
      setMessage({ type: 'success', text: `${entityLabel.singular} eliminado.` });
      await loadUsuarios();
    } catch (error) {
      setMessage({ type: 'danger', text: error.message });
    }
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
        <h1 className="mb-0">
          {title} <Badge bg="secondary" className="fs-6 align-middle">{usuarios.length}</Badge>
        </h1>
        <Button variant="success" onClick={() => setModalUsuario({})}>
          + Nuevo {entityLabel.singular}
        </Button>
      </div>

      {message && (
        <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <InputGroup className="mb-3" style={{ maxWidth: 420 }}>
        <InputGroup.Text>Buscar</InputGroup.Text>
        <Form.Control
          placeholder="Nombre, DNI, email..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </InputGroup>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th style={{ width: 160 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsuarios.length > 0 ? (
            filteredUsuarios.map((usuario) => (
              <tr key={usuario.id}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(usuario) : usuario[column.key] || '-'}</td>
                ))}
                <td>
                  <Button size="sm" variant="warning" className="me-2" onClick={() => setModalUsuario(usuario)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(usuario)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center text-muted">
                {usuarios.length === 0 ? `No hay ${entityLabel.plural} registrados.` : 'Ningún resultado coincide con la búsqueda.'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <UsuarioFormModal
        show={modalUsuario !== null}
        title={modalUsuario?.id ? `Editar ${entityLabel.singular}` : `Nuevo ${entityLabel.singular}`}
        usuario={modalUsuario}
        showDoctorFields={showDoctorFields}
        onHide={() => setModalUsuario(null)}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}
