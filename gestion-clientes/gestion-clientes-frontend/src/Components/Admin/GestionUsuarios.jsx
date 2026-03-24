import { useEffect, useState } from 'react';
import { Alert, Badge, Card, Col, Container, Form, Pagination, Row, Table } from 'react-bootstrap';
import adminService from '../../Services/adminService';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await adminService.getUsuarios();
      const usuariosResponse = extractUsuarios(response.data);
      setUsuarios(usuariosResponse);
      setError(null);
    } catch (fetchError) {
      console.error('Error al cargar usuarios:', fetchError);
      setError('No se pudieron cargar los usuarios.');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(usuarios.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const usuariosPaginados = usuarios.slice(startIndex, endIndex);

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Administrar Usuarios</h1>
        <Badge bg="secondary">Total: {usuarios.length}</Badge>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col md={4}>
              <Form.Group controlId="usuarios-page-size">
                <Form.Label>Usuarios por página</Form.Label>
                <Form.Select value={pageSize} onChange={handlePageSizeChange}>
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={8} className="text-md-end mt-3 mt-md-0">
              <span className="text-muted">
                Mostrando {usuarios.length === 0 ? 0 : startIndex + 1} a {Math.min(endIndex, usuarios.length)} de {usuarios.length} usuarios
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
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.length > 0 ? (
                usuariosPaginados.map((usuario, index) => (
                  <tr key={usuario.id ?? `${usuario.username}-${index}`}>
                    <td>{usuario.id ?? '-'}</td>
                    <td>{usuario.username}</td>
                    <td>{usuario.nombreCompleto}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <Badge bg={getRoleVariant(usuario.role)}>{usuario.role}</Badge>
                    </td>
                    <td>
                      <Badge bg={usuario.activo ? 'success' : 'danger'}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No hay usuarios para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {usuarios.length > pageSize && (
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

function extractUsuarios(data) {
  if (Array.isArray(data)) {
    return data.map(normalizeUsuario);
  }

  if (Array.isArray(data?.content)) {
    return data.content.map(normalizeUsuario);
  }

  if (Array.isArray(data?.usuarios)) {
    return data.usuarios.map(normalizeUsuario);
  }

  return [];
}

function normalizeUsuario(usuario) {
  const nombreCompleto =
    usuario.nombreCompleto ||
    usuario.fullName ||
    [usuario.nombre, usuario.apellido].filter(Boolean).join(' ') ||
    '-';

  const role = usuario.role || usuario.rol || '-';
  const username = usuario.username || usuario.userName || usuario.nombreUsuario || '-';
  const email = usuario.email || usuario.correo || '-';
  const activo =
    typeof usuario.activo === 'boolean'
      ? usuario.activo
      : typeof usuario.enabled === 'boolean'
        ? usuario.enabled
        : usuario.estado === 'ACTIVO';

  return {
    id: usuario.id,
    username,
    nombreCompleto,
    email,
    role,
    activo,
  };
}

function getRoleVariant(role) {
  const roleVariants = {
    ADMIN: 'danger',
    DOCTOR: 'primary',
    PACIENTE: 'success',
  };

  return roleVariants[role] || 'secondary';
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