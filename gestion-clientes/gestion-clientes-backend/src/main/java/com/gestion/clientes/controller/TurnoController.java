package com.gestion.clientes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
	
	
	@PutMapping ({"/admin/eliminar-turno/{id}","doctor/eliminar-turno/{id}"})
	public ResponseEntity<Object> eliminarTurno(@PathVariable Long id){
		return ResponseHandler.responseBuilder("Turno eliminado", HttpStatus.NO_CONTENT, turnoService.deleteTurno(id));
	}
	
	
	@PutMapping ("/paciente/eliminar-turno/{id}")
	public ResponseEntity<Object> eliminarTurnoComoPaciente(@PathVariable Long id){
		return ResponseHandler.responseBuilder("Turno eliminado", HttpStatus.NO_CONTENT, turnoService.eliminarTurnoComoUsuario(id));
	}
	
	
	@GetMapping("/admin/turnos")
	public ResponseEntity<Object> listarTodosLosTurnos(){
		return ResponseHandler.responseBuilder("Listado de turnos", HttpStatus.OK, turnoService.listAllTurnos());
	}
	
	@GetMapping("/admin/turnos-cancelados")
	public ResponseEntity<Object> listarTodosLosTurnosCancelados(){
		return ResponseHandler.responseBuilder("Listado de turnos cancelados", HttpStatus.OK, turnoService.listTurnosCancelados());
	}
	
	
	@GetMapping("/admin/turnos-vigentes")
	public ResponseEntity<Object> listarTodosLosTurnosVigentes(){
		return ResponseHandler.responseBuilder("Listado de turnos vigentes", HttpStatus.OK, turnoService.listTurnosVigentes());
	}
	
	
	@GetMapping("/admin/turno/{id}")
	public ResponseEntity<Object> getTurnoById(@PathVariable Long id){
		return ResponseHandler.responseBuilder("Turno obtenido por id", HttpStatus.OK, turnoService.getTurnoById(id));
	}
	
	@GetMapping("/doctor/turnos-cancelados/{id}")
	public ResponseEntity<Object> listarTodosLosTurnosCanceladosByDoctor(@PathVariable Long id){
		return ResponseHandler.responseBuilder("Listado de turnos cancelados", HttpStatus.OK, turnoService.listTurnosCanceladosByDoctor(null));
	}
	
	@GetMapping("/paciente/turnos-cancelados")
	public ResponseEntity<Object> listarTodosLosTurnosByPaciente(){
		return ResponseHandler.responseBuilder("Listado de turnos", HttpStatus.OK, turnoService.listAllTurnos());
	}

	@PutMapping ("/doctor/eliminar-turno/{id}")
	public ResponseEntity<Object> eliminarTurnoComoDoctor(@PathVariable Long id){
		return ResponseHandler.responseBuilder("Turno eliminado", HttpStatus.OK, turnoService.eliminarTurnoComoDoctor(id));
	}
	
	
	
	
	
	
	
	
}
