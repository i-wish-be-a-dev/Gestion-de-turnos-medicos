package com.gestion.clientes.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gestion.clientes.auth.LoginRequest;
import com.gestion.clientes.auth.RegisterRequest;
import com.gestion.clientes.exception.ResourceNotFoundException;
import com.gestion.clientes.jwt.JwtService;
import com.gestion.clientes.model.Role;
import com.gestion.clientes.model.Usuario;
import com.gestion.clientes.repository.UsuarioRepository;
import com.gestion.clientes.response.AuthResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final UsuarioService usuarioService;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;
	private final PasswordEncoder passwordEncoder;
	
	public AuthResponse register(RegisterRequest request) {
		Usuario user = Usuario.builder() 
				.username(request.getUsername())
				.password(passwordEncoder.encode( request.getPassword()))
				.name(request.getName())
				.lastname(request.getLastname())
				.email(request.getEmail())
				.rol(Role.USER) .build();
		usuarioService.saveUsuario(user); 
	return AuthResponse.builder()
			.token(jwtService.getToken(user))
			.build(); 
	
	}

	public AuthResponse login(LoginRequest request) {
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
	
		UserDetails user = usuarioService.findByUsername(request.getUsername());
		String token = jwtService.getToken(user);
		return AuthResponse.builder()
				.token(token)
				.build();
	}

}
