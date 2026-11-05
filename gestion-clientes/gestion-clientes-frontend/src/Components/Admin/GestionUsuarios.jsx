import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import adminService, { ROLES } from '../../Services/adminService';

const PAGE_SIZE_OPTIONS = [5, 10, 20];
// USER es el rol con el que se registra cualquiera: el admin lo valida asignándole uno de estos
const ASSIGNABLE_ROLES = ['PACIENTE', 'DOCTOR', 'ADMIN'];

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setUsuarios(await adminService.getUsuarios());
    } catch (fetchError) {
      setMessage({ type: 'danger', text: fetchError.message || 'No se pudieron cargar los usuarios.' });
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const pendientes = usuarios.filter((usuario) => usuario.rol === 'USER').length;

  const filteredUsuarios = useMemo(() => {
    const term = search.trim().toLowerCase();
    return usuarios.filter((usuario) => {
      if (roleFilter && usuario.rol !== roleFilter) {
        return false;
      }
      if (!term) {
        return true;
      }
      return [usuario.username, usuario.nombreCompleto, usuario.email, usuario.dni]
        .some((value) => value?.toLowerCase().includes(term));
    });
  }, [usuarios, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsuarios.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const usuariosPaginados = filteredUsuarios.slice(startIndex, endIndex);

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleFilterChange = (setter) => (event) => {
    setter(event.target.value);
    setCurrentPage(1);
  };

  const handleRoleChange = async (usuario, newRole) => {
    if (!newRole || newRole === usuario.rol) {
      return;
    }
    const roleLabel = ROLES[newRole].label;
    if (!window.confirm(`¿Cambiar el rol de ${usuario.username} a ${roleLabel}?`)) {
      return;
    }

    setUpdatingId(usuario.id);
    try {
      await adminService.changeRole(usuario.id, newRole);
      setUsuarios((current) =>
        current.map((item) => (item.id === usuario.id ? { ...item, rol: newRole } : item))
      );
      setMessage({ type: 'success', text: `${usuario.username} ahora es ${roleLabel}.` });
    } catch (error) {
      setMessage({ type: 'danger', text: error.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (usuario) => {
    if (!window.confirm(`¿Eliminar al usuario ${usuario.username}? Esta acción no se puede deshacer.`)) {
      return;
    }

    setUpdatingId(usuario.id);
    try {
      await adminService.deleteUsuario(usuario.id);
      setUsuarios((current) => current.filter((item) => item.id !== usuario.id));
      setMessage({ type: 'success', text: `Usuario ${usuario.username} eliminado.` });
    } catch (error) {
      setMessage({ type: 'danger', text: error.message });
    } finally {
      setUpdatingId(null);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Administrar Usuarios</h1>
        <Badge bg="secondary">Total: {usuarios.length}</Badge>
      </div>

      {message && (
        <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      {pendientes > 0 && roleFilter !== 'USER' && (
        <Alert variant="warning" className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <span>
            Hay <strong>{pendientes}</strong> usuario{pendientes > 1 ? 's' : ''} sin validar esperando que le asignes un rol.
          </span>
          <Button size="sm" variant="outline-dark" onClick={() => { setRoleFilter('USER'); setCurrentPage(1); }}>
            Ver pendientes
          </Button>
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Row className="g-3 align-items-end mb-3">
            <Col md={4}>
              <Form.Group controlId="usuarios-search">
                <Form.Label>Buscar</Form.Label>
                <Form.Control
                  placeholder="Usuario, nombre, email o DNI"
                  value={search}
                  onChange={handleFilterChange(setSearch)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="usuarios-role-filter">
                <Form.Label>Rol</Form.Label>
                <Form.Select value={roleFilter} onChange={handleFilterChange(setRoleFilter)}>
                  <option value="">Todos</option>
                  {Object.entries(ROLES).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId="usuarios-page-size">
                <Form.Label>Por página</Form.Label>
                <Form.Select value={pageSize} onChange={handlePageSizeChange}>
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="text-md-end">
              <span className="text-muted">
                Mostrando {filteredUsuarios.length === 0 ? 0 : startIndex + 1} a {Math.min(endIndex, filteredUsuarios.length)} de {filteredUsuarios.length}
              </span>
            </Col>
          </Row>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th style={{ width: 190 }}>Cambiar rol</th>
                <th style={{ width: 100 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.length > 0 ? (
                usuariosPaginados.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.username}</td>
                    <td>{usuario.nombreCompleto || '-'}</td>
                    <td>{usuario.email || '-'}</td>
                    <td>
                      <Badge bg={ROLES[usuario.rol]?.variant || 'secondary'}>
                        {ROLES[usuario.rol]?.label || usuario.rol}
                      </Badge>
                    </td>
                    <td>
                      <Form.Select
                        size="sm"
                        aria-label={`Cambiar rol de ${usuario.username}`}
                        value=""
                        disabled={updatingId === usuario.id}
                        onChange={(event) => handleRoleChange(usuario, event.target.value)}
                      >
                        <option value="">{usuario.rol === 'USER' ? 'Validar como...' : 'Cambiar a...'}</option>
                        {ASSIGNABLE_ROLES.filter((role) => role !== usuario.rol).map((role) => (
                          <option key={role} value={role}>{ROLES[role].label}</option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        disabled={updatingId === usuario.id}
                        onClick={() => handleDelete(usuario)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No hay usuarios para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {filteredUsuarios.length > pageSize && (
            <Pagination className="justify-content-center mb-0">
              <Pagination.First onClick={() => setCurrentPage(1)} disabled={safeCurrentPage === 1} />
              <Pagination.Prev onClick={() => setCurrentPage(safeCurrentPage - 1)} disabled={safeCurrentPage === 1} />
              {buildPageNumbers(safeCurrentPage, totalPages).map((page) => (
                <Pagination.Item
                  key={page}
                  active={page === safeCurrentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setCurrentPage(safeCurrentPage + 1)} disabled={safeCurrentPage === totalPages} />
              <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={safeCurrentPage === totalPages} />
            </Pagination>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

function buildPageNumbers(currentPage, totalPages) {
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const pageNumbers = [];

  for (let page = startPage; page <= endPage; page += 1) {
    pageNumbers.push(page);
  }

  return pageNumbers;
}
