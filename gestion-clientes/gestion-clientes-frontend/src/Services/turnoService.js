import apiClient from "./apiClient";

const ROLE_TURNOS_FETCHERS = {
  DOCTOR: () => apiClient.get("/api/turnos/usuario"),
  MEDICO: () => apiClient.get("/api/turnos/usuario"),
  PACIENTE: () => apiClient.get("/api/turnos/usuario"),
};

const turnoService = {
  // Obtener turnos por usuario (paciente o doctor)
  getTurnosUsario: async () => {
    return apiClient.get("/api/turnos/usuario");
  },

  // Obtener turnos según el rol autenticado
  getTurnosByRole: async (role) => {
    const normalizedRole = role?.toUpperCase();
    const fetchTurnos = ROLE_TURNOS_FETCHERS[normalizedRole];

    if (!fetchTurnos) {
      throw new Error(`Rol no soportado para listar turnos: ${role}`);
    }

    return fetchTurnos();
  },

  // Obtener turnos por doctor
  getTurnosByDoctor: async (doctorId) => {
    return apiClient.get(`/api/turnos/doctor/${doctorId}`);
  },

  // Obtener turnos por paciente
  getTurnosByPaciente: async (pacienteId) => {
    return apiClient.get(`/api/turnos/paciente/${pacienteId}`);
  },

  // Obtener un turno por ID
  getTurnoById: async (id) => {
    return apiClient.get(`/api/turnos/${id}`);
  },

  // Crear un nuevo turno
  createTurno: async (turnoData) => {
    return apiClient.post("/api/turnos", turnoData);
  },

  // Actualizar un turno
  updateTurno: async (id, turnoData) => {
    return apiClient.put(`/api/turnos/${id}`, turnoData);
  },

  // Eliminar un turno
  deleteTurno: async (id) => {
    return apiClient.delete(`/api/turnos/${id}`);
  },

  // Cambiar estado de un turno
  cambiarEstadoTurno: async (id, estado) => {
    return apiClient.put(`/api/turnos/${id}/estado`, { estado });
  },

  // Buscar turnos
  searchTurnos: async (criterios) => {
    return apiClient.post("/api/turnos/search", criterios);
  },
};

export default turnoService;
