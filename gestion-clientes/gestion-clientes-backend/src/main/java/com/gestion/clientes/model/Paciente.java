package com.gestion.clientes.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "paciente")
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Paciente {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long idPaciente;
	@OneToOne
	@JoinColumn(name = "idUsuario", referencedColumnName = "idUsuario")
	private Usuario usuario;
	@OneToMany (mappedBy = "paciente")
	private List<Turno> turnosSolicitados;
}
