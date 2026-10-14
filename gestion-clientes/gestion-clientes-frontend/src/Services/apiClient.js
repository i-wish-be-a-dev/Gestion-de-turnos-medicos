import { buildApiUrl } from '../config/api';

// Cliente HTTP centralizado para todas las peticiones a la API

function clearSessionAndRedirect() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  sessionStorage.setItem("authError", "Tu sesión venció. Inicia sesión nuevamente.");
  window.location.replace("/");
}

async function request(method, endpoint, data) {
  const token = localStorage.getItem("token");
  const response = await fetch(buildApiUrl(endpoint), {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  return handleResponse(response);
}

const apiClient = {
  get: (endpoint) => request("GET", endpoint),
  post: (endpoint, data) => request("POST", endpoint, data),
  put: (endpoint, data) => request("PUT", endpoint, data),
  delete: (endpoint) => request("DELETE", endpoint),
};

// Manejo centralizado de respuestas
const handleResponse = async (response) => {
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!response.ok) {
    // 401 = token vencido o inválido; un 403 es falta de permisos y no debe cerrar la sesión
    if (response.status === 401) {
      clearSessionAndRedirect();
    }
    const error = new Error(body?.message || `Error: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return body;
};

export default apiClient;
