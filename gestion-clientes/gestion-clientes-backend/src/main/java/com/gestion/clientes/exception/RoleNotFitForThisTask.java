package com.gestion.clientes.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class RoleNotFitForThisTask extends RuntimeException {

	private static final long serialVersionUID = 1L;


	public RoleNotFitForThisTask(String message) {
		super(message);
	}
	
	
}
