package com.gestion.clientes.dto;

import com.gestion.clientes.model.Usuario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// Body que usa el admin para crear o editar pacientes y doctores
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UsuarioRequestDto {

	private String username;
	private String password;
	private String name;
	private String lastname;
	private String dni;
	private String email;
	private String telefono;
	private String especialidad;
	private String matricula;

	public Usuario toUsuario() {
		return Usuario.builder()
				.username(username)
				.password(password)
				.name(name)
				.lastname(lastname)
				.dni(dni)
				.email(email)
				.telefono(telefono)
				.especialidad(especialidad)
				.matricula(matricula)
				.build();
	}
}
