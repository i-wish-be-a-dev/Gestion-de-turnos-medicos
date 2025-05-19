package com.gestion.clientes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion.clientes.model.Turno;
import com.gestion.clientes.model.TurnoState;

@Repository
public interface TurnoRepository extends JpaRepository<Turno,Long> {

	
	List<Turno> findByMedico_IdUsuario(Long idUsuario);
	List<Turno> findByPaciente_IdUsuario(Long idUsuario);
	List<Turno> ListByTurnoState(TurnoState estado);
	List<Turno> findByIdUsuarioAndTurnoState(Long idUsuario, TurnoState estado);
}