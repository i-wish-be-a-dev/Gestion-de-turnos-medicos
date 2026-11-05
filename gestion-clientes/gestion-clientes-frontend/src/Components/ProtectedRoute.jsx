import { Navigate } from "react-router-dom";

// Componente para proteger rutas basado en el rol del usuario
export function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/" />;
  }

  // Si se requiere un rol específico y no lo tiene, redirigir a la página denegada
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/acceso-denegado" />;
  }

  return children;
}
