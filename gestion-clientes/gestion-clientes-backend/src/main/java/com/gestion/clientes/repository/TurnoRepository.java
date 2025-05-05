package com.gestion.clientes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion.clientes.model.Turno;

@Repository
public interface TurnoRepository extends JpaRepository<Turno,Long> {

	
	List<Turno> findByMedicoIdMedico(Long idMedico);
	List<Turno> findByPacienteIdPaciente(Long idPaciente);
	
}