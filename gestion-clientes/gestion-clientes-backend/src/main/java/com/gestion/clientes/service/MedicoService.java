package com.gestion.clientes.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gestion.clientes.model.Medico;

@Service
public interface MedicoService {

	List<Medico> listAllMedicos();
	
	Medico getMedicoById(Long id);
	
	Medico actualizarMedico(Long id, Medico medicoRequest);
	
	Medico saveMedico(Medico paciente);
	
	Medico deleteMedico(Long id);
	
	
}
