package com.gestion.clientes.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestion.clientes.auth.LoginRequest;
import com.gestion.clientes.auth.RegisterRequest;
import com.gestion.clientes.model.Usuario;
import com.gestion.clientes.response.AuthResponse;
import com.gestion.clientes.response.ResponseHandler;
import com.gestion.clientes.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
	
	private final AuthService authService;

	@PostMapping(value = "login")
	public ResponseEntity<Object> login(@RequestBody LoginRequest request) {

		return ResponseHandler.responseBuilder("Usuario Logeado con exito", HttpStatus.OK,  ResponseEntity.ok(authService.login(request))); 
	}
	
	@PostMapping(value = "register")
	public ResponseEntity<Object> register(@RequestBody RegisterRequest request) {
		
		return ResponseHandler.responseBuilder("Usuario Creado con exito", HttpStatus.OK,  ResponseEntity.ok(authService.register(request)));  
		
	}
	
	
	
	
	
}
