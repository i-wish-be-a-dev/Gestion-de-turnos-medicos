package com.gestion.clientes.dto;

import java.util.List;

import com.gestion.clientes.model.Turno;
import com.gestion.clientes.model.Usuario;

// Convierte entidades a DTOs para no exponer datos sensibles (como la contraseña)
public final class DtoMapper {

	private DtoMapper() {
	}

	public static UsuarioSimpleDto toUsuarioSimpleDto(Usuario usuario) {
		if (usuario == null) {
			return null;
		}
		return UsuarioSimpleDto.builder()
				.idUsuario(usuario.getIdUsuario())
				.username(usuario.getUsername())
				.nombre(usuario.getName())
				.apellido(usuario.getLastname())
				.dni(usuario.getDni())
				.email(usuario.getEmail())
				.telefono(usuario.getTelefono())
				.especialidad(usuario.getEspecialidad())
				.matricula(usuario.getMatricula())
				.rol(usuario.getRol())
				.build();
	}

	public static List<UsuarioSimpleDto> toUsuarioSimpleDtoList(List<Usuario> usuarios) {
		return usuarios.stream().map(DtoMapper::toUsuarioSimpleDto).toList();
	}

	public static TurnoResponseDto toTurnoResponseDto(Turno turno) {
		return TurnoResponseDto.builder()
				.id(turno.getId())
				.fechaTurno(turno.getFechaTurno())
				.turnoState(turno.getTurnoState())
				.paciente(toUsuarioSimpleDto(turno.getPaciente()))
				.medico(toUsuarioSimpleDto(turno.getMedico()))
				.build();
	}

	public static List<TurnoResponseDto> toTurnoResponseDtoList(List<Turno> turnos) {
		return turnos.stream().map(DtoMapper::toTurnoResponseDto).toList();
	}
}
