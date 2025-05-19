package com.gestion.clientes.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gestion.clientes.model.Medico;
import com.gestion.clientes.model.Paciente;
import com.gestion.clientes.model.Turno;
import com.gestion.clientes.model.Usuario;

@Service
public interface TurnoService {
	
	List<Turno> listAllTurnos();
	
	List<Turno> listTurnosVigentes();

	List<Turno> listTurnosCancelados();
	
	Turno getTurnoById(Long id);
	
	Turno asignarTurno(Long idPaciente, Long idMedico, Turno data);
	
	Turno deleteTurno(Long id);
	
	Turno updateTurno(Long id, Turno turno);
	
	List <Turno> listTurnosByDoctor(Long id);
	
	List <Turno> listTurnosCanceladosByDoctor(Long id);
	
	List <Turno> listTurnosByPaciente(Long id);
	
	Turno eliminarTurnoComoUsuario(Long id);
}
