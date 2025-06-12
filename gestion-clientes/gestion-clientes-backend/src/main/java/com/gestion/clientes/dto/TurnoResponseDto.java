package com.gestion.clientes.dto;

import java.time.LocalDateTime;

import com.gestion.clientes.model.TurnoState;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class TurnoResponseDto {

	private Long id;
	private LocalDateTime  fechaTurno;
	private UsuarioSimpleDto paciente;
	private UsuarioSimpleDto medico;
	private TurnoState turnoState;
	
}
