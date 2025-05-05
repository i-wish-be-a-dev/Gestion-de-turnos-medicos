package com.gestion.clientes.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gestion.clientes.model.Paciente;

@Service
public interface PacienteService {

	
	List<Paciente> listAllPacientes();
	
	Paciente getPacienteById(Long id);
	
	Paciente actualizarPaciente(Long id, Paciente pacienteRequest);
	
	Paciente savePaciente(Paciente paciente);
	
	Paciente deletePaciente(Long id);
}
