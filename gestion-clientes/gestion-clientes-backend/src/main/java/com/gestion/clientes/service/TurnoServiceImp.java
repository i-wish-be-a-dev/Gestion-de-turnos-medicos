package com.gestion.clientes.service;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import com.gestion.clientes.dto.DtoMapper;
import com.gestion.clientes.dto.TurnoResponseDto;
import com.gestion.clientes.dto.UsuarioSimpleDto;
import com.gestion.clientes.exception.ConflictException;
import com.gestion.clientes.exception.ResourceNotFoundException;
import com.gestion.clientes.exception.RoleNotFitForThisTask;
import com.gestion.clientes.model.Role;
import com.gestion.clientes.model.Turno;
import com.gestion.clientes.model.TurnoState;
import com.gestion.clientes.model.Usuario;
import com.gestion.clientes.repository.TurnoRepository;
import com.gestion.clientes.repository.UsuarioRepository;


@Service
public class TurnoServiceImp implements TurnoService {

	@Autowired
	private TurnoRepository turnoRepository;
	@Autowired
	private UsuarioRepository usuarioRepository;

	@Override
	public List<TurnoResponseDto> listAllTurnos() {

		List<Turno> turnos = turnoRepository.findAll();

	return	turnos.stream()
		.map(
				turno -> TurnoResponseDto.builder()
				.id(turno.getId())
				.fechaTurno(turno.getFechaTurno())
				.turnoState(turno.getTurnoState())
				.paciente(toUsuarioSimpleDto(turno.getPaciente()))
				.medico(toUsuarioSimpleDto(turno.getMedico()))
				.build()
				).toList();
		
	}

	@Override
	public TurnoResponseDto getTurnoById(Long id) {
		
		Turno turno =  turnoRepository.findById(id)
				.orElseThrow(
						() -> new ResourceNotFoundException("Turno no encontrado"));

	    return TurnoResponseDto.builder()
	            .id(turno.getId())
	            .fechaTurno(turno.getFechaTurno())
	            .turnoState(turno.getTurnoState())
	            .paciente(toUsuarioSimpleDto(turno.getPaciente()))
	            .medico(toUsuarioSimpleDto(turno.getMedico()))
	            .build();
		 
		
	}

	@Override
	public TurnoResponseDto asignarTurno(Long idPaciente, Long idMedico, Turno data) {

		if (data == null || data.getFechaTurno() == null) {
			throw new IllegalArgumentException("La fecha del turno es obligatoria");
		}
		if (data.getFechaTurno().isBefore(LocalDateTime.now(ZoneId.of("America/Argentina/Buenos_Aires")))) {
			throw new IllegalArgumentException("No se puede asignar un turno en una fecha pasada");
		}

		Usuario medico = usuarioRepository.findById(idMedico)
				.orElseThrow(
						() ->  new ResourceNotFoundException("Medico no encontrado"));
		
		if(medico.getRol().equals(Role.DOCTOR)) {
			
			Usuario paciente = usuarioRepository.findById(idPaciente)
					.orElseThrow(
							() -> new ResourceNotFoundException("Paciente no encontrado"));
			
			if(paciente.getRol().equals(Role.PACIENTE)) {
			
				// los turnos duran 30 minutos: choca cualquier turno que empiece a menos de 30 minutos de este
				LocalDateTime inicio = data.getFechaTurno().minusMinutes(30);
				LocalDateTime fin = data.getFechaTurno().plusMinutes(30);

				List <Turno> conflictosByMedico= turnoRepository.findTurnosSuperpuestosByMedico(idMedico, inicio, fin, TurnoState.ELIMINADO);
				List <Turno> conflictosByPaciente= turnoRepository.findTurnosSuperpuestosByPaciente(idPaciente, inicio, fin, TurnoState.ELIMINADO);

				if (!conflictosByMedico.isEmpty()) {
					throw new ConflictException("El medico ya tiene un turno en ese horario");
				}
				if (!conflictosByPaciente.isEmpty()) {
					throw new ConflictException("El paciente ya tiene un turno en ese horario");
				}

				Turno turno =
						Turno.builder()
						.medico(medico)
						.paciente(paciente)
						.fechaTurno(data.getFechaTurno())
						.turnoState(TurnoState.VIGENTE)
						.build();

				return DtoMapper.toTurnoResponseDto(turnoRepository.save(turno));
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
		if (turnoExistente.getTurnoState() == TurnoState.ELIMINADO || turnoExistente.getTurnoState() == TurnoState.FINALIZADO) {
			throw new ConflictException("El turno " + id + " ya se encuentra " + turnoExistente.getTurnoState());
		}
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

		
	Turno turno = turnoRepository.findById(id)
			.orElseThrow(
					() -> new ResourceNotFoundException("Turno no encontrado"));
		
    LocalDateTime ahora = LocalDateTime.now(ZoneId.of("America/Argentina/Buenos_Aires"));



		
		  if (Duration.between(ahora, turno.getFechaTurno()).toHours() < 48) {
			  throw new RoleNotFitForThisTask("El usuario con id "+ id + " es un paciente y ya no puede cancelar la cita");
		    }

		  turno.setTurnoState(TurnoState.ELIMINADO);
		  return  turnoRepository.save(turno);
	}

	@Override
	public List<Turno> listTurnosVigentes() {
	
		return (List<Turno>) turnoRepository.findByTurnoState(TurnoState.VIGENTE);
	}

	@Override
	public List<Turno> listTurnosCancelados() {
		
		return (List<Turno>) turnoRepository.findByTurnoState(TurnoState.ELIMINADO);
	}

	@Override
	public List<Turno> listTurnosCanceladosByDoctor(Long id) {
		
		return (List<Turno>) turnoRepository.findByMedicoIdAndTurnoState(id, TurnoState.ELIMINADO)
				.stream()
				.filter(t -> t.getTurnoState().equals(TurnoState.ELIMINADO))
				.collect(Collectors.toList());
				
	}

	@Override
	public TurnoResponseDto finalizarTurno(Long id) {
		Turno turno = turnoRepository.findById(id)
				.orElseThrow(
						() -> new ResourceNotFoundException("Turno inexistente"));
		if (turno.getTurnoState() != TurnoState.VIGENTE) {
			throw new ConflictException("Solo se puede finalizar un turno VIGENTE");
		}
		turno.setTurnoState(TurnoState.FINALIZADO);

	    return DtoMapper.toTurnoResponseDto(turnoRepository.save(turno));
	}

	@Override
	public TurnoResponseDto confirmarTurno(Long id) {
		Turno turno = turnoRepository.findById(id)
				.orElseThrow(
						() -> new ResourceNotFoundException("Turno inexistente"));
		if (turno.getTurnoState() != TurnoState.PENDIENTE) {
			throw new ConflictException("Solo se puede confirmar un turno PENDIENTE");
		}
		turno.setTurnoState(TurnoState.VIGENTE);

		return DtoMapper.toTurnoResponseDto(turnoRepository.save(turno));
	}

	@Override
	public TurnoResponseDto eliminarTurnoComoDoctor(Long id) {
		// el doctor puede cancelar en cualquier momento, sin la restriccion de 48 hs del paciente
		return DtoMapper.toTurnoResponseDto(deleteTurno(id));
	}

	//esto esta re desubicado pero lo dejo aca para no olvidarlo, es para convertir un usuario a un dto mas simple que se muestra en los turnos
	//el usuario podria contener mas cosas despues, y no quiero modificar el performance 
	// de los turnos por eso hago esta conversion a un dto mas simple,
	//  ademas de que el usuario tiene la contraseña y no quiero mostrarla en los turnos

	private UsuarioSimpleDto toUsuarioSimpleDto(Usuario usuario) {
		return DtoMapper.toUsuarioSimpleDto(usuario);
	}

	
	
	
	
	
	
	
}
