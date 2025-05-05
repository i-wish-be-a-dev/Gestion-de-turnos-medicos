package com.gestion.clientes.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gestion.clientes.model.Medico;
import com.gestion.clientes.model.Paciente;
import com.gestion.clientes.model.Turno;
import com.gestion.clientes.model.Usuario;

@Service
public interface TurnoService {

	List<Turno> findByMedicoIdMedico(Long idMedico);
	
	List<Turno> findByPacienteIdPaciente(Long idPaciente);
	
	List<Turno> listAllTurnos();
	
	Turno getTurnoById(Long id);
	
	Turno asignarTurno(Long idPaciente, Long idMedico, Turno data);
	
	Turno deleteTurno(Long id);
	
	Turno updateTurno(Long id, Turno turno);
}
