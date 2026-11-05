import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";

const ROLE_NAV_LINKS = {
  ADMIN: [
    { label: "Turnos", href: "/admin/turnos" },
    { label: "Pacientes", href: "/admin/pacientes" },
    { label: "Doctores", href: "/admin/doctores" },
    { label: "Administrar Usuarios", href: "/admin/usuarios" },
  ],
  DOCTOR: [
    { label: "Dashboard", href: "/doctor/dashboard" },
    { label: "Mis Turnos", href: "/doctor/mis-turnos" },
    { label: "Perfil", href: "/doctor/perfil" },
  ],
  PACIENTE: [
    { label: "Dashboard", href: "/paciente/dashboard" },
    { label: "Mis Turnos", href: "/paciente/mis-turnos" },
    { label: "Reservar Turno", href: "/paciente/reservar-turno" },
    { label: "Perfil", href: "/paciente/perfil" },
  ],
};

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const navLinks = ROLE_NAV_LINKS[userRole] || [];

  return (
    <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={NavLink} to={token ? "/dashboard" : "/"} className="fw-bold">
          <i className="bi bi-hospital"></i> Gestor de Turnos Médicos
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {token && (
              <>
                {navLinks.map((link) => (
                  <Nav.Link
                    key={link.href}
                    as={NavLink}
                    to={link.href}
                    active={location.pathname === link.href}
                  >
                    {link.label}
                  </Nav.Link>
                ))}

                <Nav.Link className="ms-3">
                  <Dropdown>
                    <Dropdown.Toggle variant="link" id="user-dropdown" className="text-dark">
                      <i className="bi bi-person-circle"></i> {userRole}
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end">
                      <Dropdown.Item disabled>
                        {userRole}
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout} className="text-danger">
                        <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
