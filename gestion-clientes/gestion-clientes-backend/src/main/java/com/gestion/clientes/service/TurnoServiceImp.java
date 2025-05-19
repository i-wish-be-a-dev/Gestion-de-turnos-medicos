package com.gestion.clientes.service;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import com.gestion.clientes.exception.ResourceNotFoundException;
import com.gestion.clientes.exception.RoleNotFitForThisTask;
import com.gestion.clientes.model.Role;
import com.gestion.clientes.model.Turno;
import com.gestion.clientes.model.TurnoState;
import com.gestion.clientes.model.Usuario;
import com.gestion.clientes.repository.TurnoRepository;
import com.gestion.clientes.repository.UsuarioRepository;



public class TurnoServiceImp implements TurnoService {

	@Autowired
	private TurnoRepository turnoRepository;
	@Autowired
	private UsuarioRepository usuarioRepository;

	@Override
	public List<Turno> listAllTurnos() {

		return (List<Turno>) turnoRepository.findAll();
	}

	@Override
	public Turno getTurnoById(Long id) {
		
		return turnoRepository.findById(id)
				.orElseThrow(
						() -> new ResourceNotFoundException("Turno no encontrado"));

	}

	@Override
	public Turno asignarTurno(Long idPaciente, Long idMedico, Turno data) {
	
		Usuario medico = usuarioRepository.findById(idMedico)
				.orElseThrow(
						() ->  new ResourceNotFoundException("Medico no encontrado"));
		
		if(medico.getRol().equals(Role.DOCTOR)) {
			
			Usuario paciente = usuarioRepository.findById(idPaciente)
					.orElseThrow(
							() -> new ResourceNotFoundException("Paciente no encontrado"));
			
			if(paciente.getRol().equals(Role.PACIENTE)) {
				Turno turno = 
						Turno.builder()
						.medico(medico)
						.paciente(paciente)
						.fechaTurno(data.getFechaTurno())
						.turnoState(TurnoState.VIGENTE)
						.build();
				return turnoRepository.save(turno);
			}
			else {

throw new RoleNotFitForThisTask("El usuario con id "+ idPaciente + " no es un paciente");
				
			}
		}
		
		throw new RoleNotFitForThisTask("El usuario con id "+ idMedico + " no es un medico");

	}

	@Override
	public Turno deleteTurno(Long id) {
		
		Turno turnoExistente = turnoRepository.findById(id)
				.orElseThrow(
						() -> new ResourceNotFoundException("Turno inexistente"));
		turnoExistente.setTurnoState(TurnoState.ELIMINADO);
		return turnoRepository.save(turnoExistente);
	}

	@Override
	public Turno updateTurno(Long id, Turno turno) {
		Turno turnoExistente = turnoRepository.findById(id)
				.orElseThrow(
						() -> new ResourceNotFoundException("Turno inexistente"));
		turnoExistente.setFechaTurno(turno.getFechaTurno());
		turnoExistente.setMedico(turno.getMedico());
		turnoExistente.setPaciente(turno.getPaciente());
		
		return turnoRepository.save(turnoExistente);
	}


	@Override
	public List<Turno> listTurnosByDoctor(Long id) {
		
		Usuario usuario = usuarioRepository.findById(id)
				.orElseThrow(
						() ->  new ResourceNotFoundException("Medico no encontrado"));
		
		if(!usuario.getRol().equals(Role.DOCTOR)) {
			
throw new RoleNotFitForThisTask("El usuario con id "+ id + " no es un doctor");
				
			}else {
				
				return (List<Turno>) turnoRepository.findByMedico_IdUsuario(id);
			}
		}

	@Override
	public List<Turno> listTurnosByPaciente(Long id) {
		
		Usuario usuario = usuarioRepository.findById(id)
				.orElseThrow(
						() ->  new ResourceNotFoundException("Paciente no encontrado"));
		
		if(!usuario.getRol().equals(Role.PACIENTE)) {
			
throw new RoleNotFitForThisTask("El usuario con id "+ id + " no es un paciente");
				
			}else {
				
				return (List<Turno>) turnoRepository.findByPaciente_IdUsuario(id);
			}
		
	}

	@Override
	public Turno eliminarTurnoComoUsuario(Long id) {
//		Usuario usuario = usuarioRepository.findById(id)
//				.orElseThrow(
//						() ->  new ResourceNotFoundException("Paciente no encontrado"));
		
	Turno turno = turnoRepository.findById(id)
			.orElseThrow(
					() -> new ResourceNotFoundException("Turno no encontrado"));
		
		Date now = new Date();
		long horasDiferencia = (turno.getFechaTurno().getTime() - now.getTime()) / (1000 * 60 * 60);

		if(horasDiferencia < 48) {
			
			throw new RoleNotFitForThisTask("El usuario con id "+ id + " es un paciente y ya no puede cancelar la cita");
		}
		turnoRepository.delete(turno);
		return turno;
	}

	@Override
	public List<Turno> listTurnosVigentes() {
	
		return (List<Turno>) turnoRepository.ListByTurnoState(TurnoState.VIGENTE);
	}

	@Override
	public List<Turno> listTurnosCancelados() {
		
		return (List<Turno>) turnoRepository.ListByTurnoState(TurnoState.ELIMINADO);
	}

	@Override
	public List<Turno> listTurnosCanceladosByDoctor(Long id) {
		
		return (List<Turno>) turnoRepository.findByIdUsuarioAndTurnoState(id, TurnoState.ELIMINADO)
				.stream()
				.filter(t -> t.getTurnoState().equals(TurnoState.ELIMINADO))
				.collect(Collectors.toList());
				
	}

	
	
}
