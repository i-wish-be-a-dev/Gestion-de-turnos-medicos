import apiClient from './apiClient';

function normalizeUsuario(usuario) {
  return {
    ...usuario,
    id: usuario.id ?? usuario.idUsuario,
    nombre: usuario.nombre ?? usuario.name ?? '',
    apellido: usuario.apellido ?? usuario.lastname ?? '',
    dni: usuario.dni ?? '',
    email: usuario.email ?? '',
    telefono: usuario.telefono ?? '',
    rol: usuario.rol ?? '',
  };
}

function toBackendUsuarioPayload(usuario) {
  return {
    name: usuario.nombre ?? usuario.name ?? '',
    lastname: usuario.apellido ?? usuario.lastname ?? '',
    dni: usuario.dni ?? '',
    email: usuario.email ?? '',
    telefono: usuario.telefono ?? '',
  };
}

const adminService = {
  getUsuarios: async () => {
    const response = await apiClient.get('/admin/usuarios');
    return {
      ...response,
      data: Array.isArray(response.data)
        ? response.data.map(normalizeUsuario)
        : [],
    };
  },

  getPacientes: async () => {
    const response = await apiClient.get('/admin/pacientes');
    return {
      ...response,
      data: Array.isArray(response.data)
        ? response.data.map(normalizeUsuario)
        : [],
    };
  },

  getDoctores: async () => {
    const response = await apiClient.get('/admin/doctores');
    return {
      ...response,
      data: Array.isArray(response.data)
        ? response.data.map(normalizeUsuario)
        : [],
    };
  },

  createDoctor: async (doctorData) => {
    return apiClient.post('/admin/doctores', doctorData);
  },

  updateDoctor: async (id, doctorData) => {
    return apiClient.put(`/admin/usuarios/${id}`, toBackendUsuarioPayload(doctorData));
  },

  deleteDoctor: async (id) => {
    return apiClient.delete(`/admin/usuarios/${id}`);
  },

  getTurnos: async () => {
    return apiClient.get('/admin/turnos');
  },

  createPaciente: async (pacienteData) => {
    return apiClient.post('/api/pacientes', pacienteData);
  },

  updatePaciente: async (id, pacienteData) => {
    return apiClient.put(`/admin/usuarios/${id}`, toBackendUsuarioPayload(pacienteData));
  },

  deletePaciente: async (id) => {
    return apiClient.delete(`/admin/usuarios/${id}`);
  },
};

export default adminService;