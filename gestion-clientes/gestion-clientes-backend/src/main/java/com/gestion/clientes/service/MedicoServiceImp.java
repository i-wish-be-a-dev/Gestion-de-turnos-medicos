package com.gestion.clientes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.gestion.clientes.exception.ResourceNotFoundException;
import com.gestion.clientes.model.Medico;
import com.gestion.clientes.repository.MedicoRepository;

public class MedicoServiceImp implements MedicoService {

	@Autowired
	private MedicoRepository medicoRepository;
	
	@Override
	public List<Medico> listAllMedicos() {
		
		return (List<Medico>) medicoRepository.findAll();
	}

	@Override
	public Medico getMedicoById(Long id) {
	
		return medicoRepository.findById(id)
				.orElseThrow(
						() -> new ResourceNotFoundException("Medico no encontrado"));
	}

	@Override
	public Medico actualizarMedico(Long id, Medico medicoRequest) {
		
		Medico medicoExistente = medicoRepository.findById(id)
				.orElseThrow(
						() -> new ResourceNotFoundException("Medico no encontrado"));
				
		medicoExistente.setEspecialidad(medicoRequest.getEspecialidad());
	
		return medicoRepository.save(medicoExistente);
	}

	@Override
	public Medico saveMedico(Medico paciente) {

		 return medicoRepository.save(paciente);
	}

	@Override
	public Medico deleteMedico(Long id) {
		
		Medico medicoExistente = medicoRepository.findById(id)
				.orElseThrow(
						() -> new ResourceNotFoundException("Medico no encontrado"));

		 medicoRepository.deleteById(id);
		return medicoExistente;
	}

}
