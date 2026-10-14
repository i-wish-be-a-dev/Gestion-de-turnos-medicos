import apiClient from './apiClient';

export const TURNO_STATES = {
  PENDIENTE: { label: 'Pendiente', variant: 'warning' },
  VIGENTE: { label: 'Vigente', variant: 'primary' },
  FINALIZADO: { label: 'Finalizado', variant: 'success' },
  ELIMINADO: { label: 'Cancelado', variant: 'danger' },
};

export const ROLES = {
  ADMIN: { label: 'Admin', variant: 'danger' },
  DOCTOR: { label: 'Doctor', variant: 'primary' },
  PACIENTE: { label: 'Paciente', variant: 'success' },
  USER: { label: 'Sin validar', variant: 'secondary' },
};

const ROLE_ENDPOINTS = {
  ADMIN: 'set-admin',
  DOCTOR: 'set-doctor',
  PACIENTE: 'set-paciente',
};

// El backend responde UsuarioSimpleDto: { idUsuario, username, nombre, apellido, ... }
export function normalizeUsuario(usuario) {
  if (!usuario) {
    return null;
  }

  const nombre = usuario.nombre ?? usuario.name ?? '';
  const apellido = usuario.apellido ?? usuario.lastname ?? '';

  return {
    id: usuario.idUsuario ?? usuario.id,
    username: usuario.username ?? '',
    nombre,
    apellido,
    nombreCompleto: [nombre, apellido].filter(Boolean).join(' '),
    dni: usuario.dni ?? '',
    email: usuario.email ?? '',
    telefono: usuario.telefono ?? '',
    especialidad: usuario.especialidad ?? '',
    matricula: usuario.matricula ?? '',
    rol: usuario.rol ?? '',
  };
}

export function displayName(usuario) {
  return usuario?.nombreCompleto || usuario?.username || '-';
}

function normalizeTurno(turno) {
  return {
    id: turno.id,
    fecha: turno.fechaTurno ? new Date(turno.fechaTurno) : null,
    fechaTurno: turno.fechaTurno,
    estado: turno.turnoState,
    medico: normalizeUsuario(turno.medico),
    paciente: normalizeUsuario(turno.paciente),
  };
}

// Lo que espera UsuarioRequestDto en el backend
function toUsuarioRequest(usuario, { includeCredentials }) {
  const payload = {
    name: usuario.nombre?.trim() ?? '',
    lastname: usuario.apellido?.trim() ?? '',
    dni: usuario.dni?.trim() ?? '',
    email: usuario.email?.trim() ?? '',
    telefono: usuario.telefono?.trim() ?? '',
    especialidad: usuario.especialidad?.trim() ?? '',
    matricula: usuario.matricula?.trim() ?? '',
  };

  if (includeCredentials) {
    payload.username = usuario.username?.trim() ?? '';
    payload.password = usuario.password ?? '';
  }

  return payload;
}

const listOf = (mapper) => (response) => (Array.isArray(response?.data) ? response.data.map(mapper) : []);

const adminService = {
  // Usuarios
  getUsuarios: () => apiClient.get('/admin/usuarios').then(listOf(normalizeUsuario)),
  getPacientes: () => apiClient.get('/admin/pacientes').then(listOf(normalizeUsuario)),
  getDoctores: () => apiClient.get('/admin/doctores').then(listOf(normalizeUsuario)),

  createPaciente: (data) =>
    apiClient.post('/admin/pacientes', toUsuarioRequest(data, { includeCredentials: true })),
  createDoctor: (data) =>
    apiClient.post('/admin/doctores', toUsuarioRequest(data, { includeCredentials: true })),
  updateUsuario: (id, data) =>
    apiClient.put(`/admin/usuarios/${id}`, toUsuarioRequest(data, { includeCredentials: false })),
  deleteUsuario: (id) => apiClient.delete(`/admin/usuarios/${id}`),

  changeRole: (id, role) => {
    const endpoint = ROLE_ENDPOINTS[role];
    if (!endpoint) {
      return Promise.reject(new Error(`Rol no soportado: ${role}`));
    }
    return apiClient.put(`/admin/${endpoint}/${id}`);
  },

  // Turnos
  getTurnos: () => apiClient.get('/admin/turnos').then(listOf(normalizeTurno)),

  // fechaTurno con formato yyyy-MM-ddTHH:mm:ss (el que espera el @JsonFormat de Turno)
  asignarTurno: (idPaciente, idMedico, fechaTurno) =>
    apiClient.post(`/admin/asignar-turno/${idPaciente}/${idMedico}`, { fechaTurno }),
  cancelarTurno: (id) => apiClient.put(`/admin/eliminar-turno/${id}`),
  finalizarTurno: (id) => apiClient.put(`/admin/finalizar-turno/${id}`),
  confirmarTurno: (id) => apiClient.put(`/admin/confirmar-turno/${id}`),
};

export default adminService;
