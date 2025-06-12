package com.gestion.clientes.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "turnos")
@Builder
public class Turno {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "America/Argentina/Buenos_Aires")
	private LocalDateTime  fechaTurno;
	
	@ManyToOne
	@JoinColumn(name = "idPaciente")
	@JsonIgnoreProperties("turnos")
	private Usuario paciente;
	
	@ManyToOne
	@JoinColumn(name = "idMedico")
	@JsonIgnoreProperties("turnos")
	private Usuario medico;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "turnoState ")
	private TurnoState turnoState;
	
}
