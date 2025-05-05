package com.gestion.clientes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.gestion.clientes.exception.ResourceNotFoundException;
import com.gestion.clientes.model.Paciente;
import com.gestion.clientes.repository.PacienteRepository;

public class PacienteServiceImp implements PacienteService {

	@Autowired
	private PacienteRepository pacienteRepository;
	
	
	@Override
	public List<Paciente> listAllPacientes() {
		
		return (List<Paciente>) pacienteRepository.findAll();
	}

	@Override
	public Paciente getPacienteById(Long id) {
		return pacienteRepository.findById(id)
				.orElseThrow(
						() -> new ResourceNotFoundException("Paciente no encontrado"));
	}

	@Override
	public Paciente actualizarPaciente(Long id, Paciente pacienteRequest) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Paciente savePaciente(Paciente paciente) {
		return pacienteRepository.save(paciente);
	}

	@Override
	public Paciente deletePaciente(Long id) {
		
		Paciente pacienteExistente = pacienteRepository.findById(id)
				.orElseThrow(
						() -> new ResourceNotFoundException("Turno inexistente"));
		
		pacienteRepository.deleteById(id);
	return pacienteExistente;			
	}

}
