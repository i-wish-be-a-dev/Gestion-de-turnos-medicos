package com.gestion.clientes.service;

import com.gestion.clientes.exception.ResourceNotFoundException;
import com.gestion.clientes.model.Usuario;
import com.gestion.clientes.response.AuthResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
@RequiredArgsConstructor 
public class TemporaryPasswordServiceImpl implements TemporaryPasswordService {

	@Autowired
	private final AdminService usuarioService;

	private final PasswordEncoder passwordEncoder;

	@Value("${app.temporary.password:TempPass123}")
	private String temporalPasswordProperty;
 

    @Override
 	public String generateTemporalPassword(String username) {
		Usuario user = usuarioService.findByUsername(username);
		if (user == null) {
			throw new ResourceNotFoundException("Usuario no encontrado: " + username);
		}
		
		String temporalPassword = generateRandomPassword();
		user.setPassword(passwordEncoder.encode(temporalPassword));
		return temporalPassword;
	}

	private String generateRandomPassword() {
		return temporalPasswordProperty;
	}

    
}
