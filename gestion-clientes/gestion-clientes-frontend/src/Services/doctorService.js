import apiClient from "./apiClient";

const doctorService = {
  // Obtener todos los doctores
  getAllDoctores: async () => {
    return apiClient.get("/api/doctores");
  },

  // Obtener un doctor por ID
  getDoctorById: async (id) => {
    return apiClient.get(`/api/doctores/${id}`);
  },

  // Obtener doctor actual (logueado)
  getDoctorActual: async () => {
    return apiClient.get("/api/doctores/perfil");
  },

  // Crear un nuevo doctor
  createDoctor: async (doctorData) => {
    return apiClient.post("/api/doctores", doctorData);
  },

  // Actualizar un doctor
  updateDoctor: async (id, doctorData) => {
    return apiClient.put(`/api/doctores/${id}`, doctorData);
  },

  // Eliminar un doctor
  deleteDoctor: async (id) => {
    return apiClient.delete(`/api/doctores/${id}`);
  },

  // Obtener doctores por especialidad
  getDoctoresByEspecialidad: async (especialidadId) => {
    return apiClient.get(`/api/doctores/especialidad/${especialidadId}`);
  },

  // Obtener horarios disponibles de un doctor
  getHorariosDisponibles: async (doctorId, fecha) => {
    return apiClient.get(`/api/doctores/${doctorId}/horarios?fecha=${fecha}`);
  },

  // Actualizar perfil del doctor
  updatePerfil: async (doctorData) => {
    return apiClient.put("/api/doctores/perfil", doctorData);
  },
};

export default doctorService;
