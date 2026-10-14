import adminService from '../../Services/adminService';
import UsuariosCrud from './UsuariosCrud';

const COLUMNS = [
  { key: 'matricula', label: 'Matrícula' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellido', label: 'Apellido' },
  { key: 'especialidad', label: 'Especialidad' },
  { key: 'email', label: 'Email' },
  { key: 'telefono', label: 'Teléfono' },
];

const LABEL = { singular: 'Doctor', plural: 'doctores' };

export default function GestionDoctores() {
  return (
    <UsuariosCrud
      title="Gestión de Doctores"
      entityLabel={LABEL}
      fetchUsuarios={adminService.getDoctores}
      createUsuario={adminService.createDoctor}
      columns={COLUMNS}
      showDoctorFields
    />
  );
}
