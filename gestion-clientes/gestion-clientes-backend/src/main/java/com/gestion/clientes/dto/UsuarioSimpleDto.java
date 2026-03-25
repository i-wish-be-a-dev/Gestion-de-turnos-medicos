package com.gestion.clientes.dto;

import com.gestion.clientes.model.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UsuarioSimpleDto {

	private String username;
	private String nombre;
	private String apellido;
	private String dni;
	private String email;
	private String telefono;
	private Role rol;
	private Long idUsuario;
}
