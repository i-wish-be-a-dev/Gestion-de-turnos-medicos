import apiClient from "./apiClient";

const pacienteService = {
  // Obtener todos los pacientes
  getAllPacientes: async () => {
    return apiClient.get("/api/pacientes");
  },

  // Obtener un paciente por ID
  getPacienteById: async (id) => {
    return apiClient.get(`/api/pacientes/${id}`);
  },

  // Obtener paciente actual (logueado)
  getPacienteActual: async () => {
    return apiClient.get("/api/pacientes/perfil");
  },

  // Crear un nuevo paciente
  createPaciente: async (pacienteData) => {
    return apiClient.post("/api/pacientes", pacienteData);
  },

  // Actualizar un paciente
  updatePaciente: async (id, pacienteData) => {
    return apiClient.put(`/api/pacientes/${id}`, pacienteData);
  },

  // Eliminar un paciente
  deletePaciente: async (id) => {
    return apiClient.delete(`/api/pacientes/${id}`);
  },

  // Actualizar perfil del paciente
  updatePerfil: async (pacienteData) => {
    return apiClient.put("/api/pacientes/perfil", pacienteData);
  },

  // Buscar pacientes
  searchPacientes: async (criterios) => {
    return apiClient.post("/api/pacientes/search", criterios);
  },
};

export default pacienteService;
