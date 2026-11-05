package com.gestion.clientes.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.gestion.clientes.response.ResponseHandler;

// Devuelve los errores con el mismo formato que las respuestas exitosas
// para que el frontend pueda mostrar el mensaje al usuario
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<Object> handleNotFound(ResourceNotFoundException ex) {
		return ResponseHandler.responseBuilder(ex.getMessage(), HttpStatus.NOT_FOUND, null);
	}

	@ExceptionHandler(RoleNotFitForThisTask.class)
	public ResponseEntity<Object> handleRoleNotFit(RoleNotFitForThisTask ex) {
		return ResponseHandler.responseBuilder(ex.getMessage(), HttpStatus.FORBIDDEN, null);
	}

	@ExceptionHandler(ConflictException.class)
	public ResponseEntity<Object> handleConflict(ConflictException ex) {
		return ResponseHandler.responseBuilder(ex.getMessage(), HttpStatus.CONFLICT, null);
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Object> handleBadRequest(IllegalArgumentException ex) {
		return ResponseHandler.responseBuilder(ex.getMessage(), HttpStatus.BAD_REQUEST, null);
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<Object> handleDataIntegrity(DataIntegrityViolationException ex) {
		return ResponseHandler.responseBuilder(
				"La operacion viola una restriccion de datos (usuario o email duplicado, o registros asociados)",
				HttpStatus.CONFLICT, null);
	}
}
