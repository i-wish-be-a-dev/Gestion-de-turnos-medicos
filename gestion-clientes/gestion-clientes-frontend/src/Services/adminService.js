import apiClient from './apiClient';

const adminService = {
  getUsuarios: async () => {
    return apiClient.get('/admin/usuarios');
  },

  getPacientes: async () => {
    return apiClient.get('/admin/usuarios');
  },

  getDoctores: async () => {
    return apiClient.get('/admin/doctores');
  },

  createDoctor: async (doctorData) => {
    return apiClient.post('/admin/doctores', doctorData);
  },

  updateDoctor: async (id, doctorData) => {
    return apiClient.put(`/admin/doctores/${id}`, doctorData);
  },

  deleteDoctor: async (id) => {
    return apiClient.delete(`/admin/doctores/${id}`);
  },

  getTurnos: async () => {
    return apiClient.get('/admin/turnos');
  },

  createPaciente: async (pacienteData) => {
    return apiClient.post('/api/pacientes', pacienteData);
  },

  updatePaciente: async (id, pacienteData) => {
    return apiClient.put(`/api/pacientes/${id}`, pacienteData);
  },

  deletePaciente: async (id) => {
    return apiClient.delete(`/api/pacientes/${id}`);
  },
};

export default adminService;