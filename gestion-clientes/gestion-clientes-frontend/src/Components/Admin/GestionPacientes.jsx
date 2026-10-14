import adminService from '../../Services/adminService';
import UsuariosCrud from './UsuariosCrud';

const COLUMNS = [
  { key: 'dni', label: 'DNI' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellido', label: 'Apellido' },
  { key: 'username', label: 'Usuario' },
  { key: 'email', label: 'Email' },
  { key: 'telefono', label: 'Teléfono' },
];

const LABEL = { singular: 'Paciente', plural: 'pacientes' };

export default function GestionPacientes() {
  return (
    <UsuariosCrud
      title="Gestión de Pacientes"
      entityLabel={LABEL}
      fetchUsuarios={adminService.getPacientes}
      createUsuario={adminService.createPaciente}
      columns={COLUMNS}
    />
  );
}
