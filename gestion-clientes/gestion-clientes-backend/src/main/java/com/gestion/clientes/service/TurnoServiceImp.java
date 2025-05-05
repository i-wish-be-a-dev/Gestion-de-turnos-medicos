package com.gestion.clientes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.gestion.clientes.exception.ResourceNotFoundException;
import com.gestion.clientes.model.Medico;
import com.gestion.clientes.model.Paciente;
import com.gestion.clientes.model.Turno;
import com.gestion.clientes.model.Usuario;
import com.gestion.clientes.repository.MedicoRepository;
import com.gestion.clientes.repository.PacienteRepository;
import com.gestion.clientes.repository.TurnoRepository;

public class TurnoServiceImp implements TurnoService {

	@Autowired
	private TurnoRepository turnoRepository;
	@Autowired
	private PacienteRepository pacienteRepository;
	@Autowired
	private MedicoRepository medicoRepository;
	
	
	

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
	
		Medico medico = medicoRepository.findById(idMedico)
				.orElseThrow(
						() ->  new ResourceNotFoundException("Medico no encontrado"));
		
		Paciente paciente = pacienteRepository.findById(idPaciente)
				.orElseThrow(
						() -> new ResourceNotFoundException("Paciente no encontrado"));
		
		Turno turno = 
				Turno.builder()
				.medico(medico)
				.paciente(paciente)
				.fechaTurno(data.getFechaTurno())
				.build();

	return turnoRepository.save(turno);
	
	}

	@Override
	public Turno deleteTurno(Long id) {
		
		Turno turnoExistente = turnoRepository.findById(id)
				.orElseThrow(
						() -> new ResourceNotFoundException("Turno inexistente"));
		
	turnoRepository.deleteById(id);
	return turnoExistente;			
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
	public List<Turno> findByMedicoIdMedico(Long idMedico) {

		return (List<Turno>) turnoRepository.findByMedicoIdMedico(idMedico);
		
	}

	@Override
	public List<Turno> findByPacienteIdPaciente(Long idPaciente) {
		
		return (List<Turno>) turnoRepository.findByPacienteIdPaciente(idPaciente);
	}

}
