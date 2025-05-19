package com.gestion.clientes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestion.clientes.model.Turno;
import com.gestion.clientes.response.ResponseHandler;
import com.gestion.clientes.service.TurnoService;

@RestController
@RequestMapping()
public class TurnoController {

	@Autowired
	private TurnoService turnoService;
	
	
	@PostMapping("/admin/asignar-turno/{idPaciente}/{idMedico}")
	public ResponseEntity<Object> crearTurno(@RequestBody Turno turno,@PathVariable Long idPaciente,@PathVariable Long idMedico){
		return ResponseHandler.responseBuilder("Turno creado", HttpStatus.CREATED, turnoService.asignarTurno(idPaciente, idMedico, turno));
	}
	
	
	@DeleteMapping ({"/admin/eliminar-turno/{id}","doctor/eliminar-turno/{id}"})
	public ResponseEntity<Object> eliminarTurno(@PathVariable Long id){
		return ResponseHandler.responseBuilder("Turno eliminado", HttpStatus.CREATED, turnoService.deleteTurno(id));
	}
	
	
	@DeleteMapping ("/paciente/eliminar-turno/{id}")
	public ResponseEntity<Object> eliminarTurnoComoPaciente(@PathVariable Long id){
		return ResponseHandler.responseBuilder("Turno eliminado", HttpStatus.CREATED, turnoService.eliminarTurnoComoUsuario(id));
	}
	
	
	@GetMapping("/admin/turnos")
	public ResponseEntity<Object> listarTodosLosTurnos(){
		return ResponseHandler.responseBuilder("Turno eliminado", HttpStatus.CREATED, turnoService.listAllTurnos());
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
