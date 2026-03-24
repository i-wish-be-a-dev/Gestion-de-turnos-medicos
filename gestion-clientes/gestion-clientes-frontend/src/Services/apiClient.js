import { buildApiUrl } from '../config/api';

// Cliente HTTP centralizado para todas las peticiones a la API

function clearSessionAndRedirect() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  sessionStorage.setItem("authError", "Tu sesión venció. Inicia sesión nuevamente.");
  window.location.replace("/");
}

const apiClient = {
  // Métodos GET
  get: async (endpoint) => {
    const token = localStorage.getItem("token");
    const response = await fetch(buildApiUrl(endpoint), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return handleResponse(response);
  },

  // Métodos POST
  post: async (endpoint, data) => {
    const token = localStorage.getItem("token");
    const response = await fetch(buildApiUrl(endpoint), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Métodos PUT
  put: async (endpoint, data) => {
    const token = localStorage.getItem("token");
    const response = await fetch(buildApiUrl(endpoint), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Métodos DELETE
  delete: async (endpoint) => {
    const token = localStorage.getItem("token");
    const response = await fetch(buildApiUrl(endpoint), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return handleResponse(response);
  },
};

// Manejo centralizado de respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearSessionAndRedirect();
    }
    throw new Error(`Error: ${response.status}`);
  }
  return await response.json();
};

export default apiClient;
