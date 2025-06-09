package com.gestion.clientes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestion.clientes.model.Turno;
import com.gestion.clientes.model.TurnoState;

@Repository
public interface TurnoRepository extends JpaRepository<Turno,Long> {

	
	List<Turno> findByMedico_IdUsuario(Long idUsuario);
	List<Turno> findByPaciente_IdUsuario(Long idUsuario);
	List<Turno> findByTurnoState(TurnoState estado);
//	List<Turno> findByIdUsuarioAndTurnoState(Long idUsuario, TurnoState estado);
	@Query("SELECT t FROM Turno t WHERE t.paciente.idUsuario = :usuarioId AND t.turnoState = :estado")
	List<Turno> findByPacienteIdAndTurnoState(@Param("usuarioId") Long usuarioId, @Param("estado") TurnoState estado);


	@Query("SELECT t FROM Turno t WHERE t.medico.idUsuario = :usuarioId AND t.turnoState = :estado")
	List<Turno> findByMedicoIdAndTurnoState(@Param("usuarioId") Long usuarioId, @Param("estado") TurnoState estado);

	
}