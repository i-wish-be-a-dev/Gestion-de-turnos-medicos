import { useEffect, useState } from "react";
import '../../Styles/LoginForm.css';
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from '../../config/api';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authError = sessionStorage.getItem("authError");

    if (authError) {
      setError(authError);
      sessionStorage.removeItem("authError");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(buildApiUrl('/auth/login'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();
      const authPayload = extractAuthPayload(data);
      const token = authPayload.token;
      const role = normalizeRole(authPayload.role);

      if (!token || !role) {
        throw new Error("La respuesta de autenticación no contiene token o rol válido.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      navigate(getDashboardRouteByRole(role));
    } catch (error) {
      setError(error.message || "Error al iniciar sesión. Intente nuevamente.");
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="content" className="container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Gestión de Turnos Médicos</h1>
          <p className="login-subtitle">Inicia sesión en tu cuenta</p>
        </div>

        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Usuario
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Ingrese su usuario"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ingrese su contraseña"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>

            <a href="#" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}

function extractAuthPayload(data) {
  return (
    data?.data?.body ||
    data?.data?.authResponse ||
    data?.data ||
    data?.body ||
    data
  );
}

function normalizeRole(role) {
  const normalizedRole = role?.toUpperCase();

  if (normalizedRole === "MEDICO") {
    return "DOCTOR";
  }

  return normalizedRole;
}

function getDashboardRouteByRole(role) {
  switch (role) {
    case "ADMIN":
      return "/admin/turnos";
    case "DOCTOR":
      return "/doctor/dashboard";
    case "PACIENTE":
      return "/paciente/dashboard";
    default:
      throw new Error(`Rol no soportado: ${role}`);
  }
}
