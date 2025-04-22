package com.gestion.clientes.test.repository;



import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.gestion.clientes.auth.RegisterRequest;
import com.gestion.clientes.jwt.JwtService;
import com.gestion.clientes.model.Role;
import com.gestion.clientes.model.Usuario;
import com.gestion.clientes.repository.UsuarioRepository;
import com.gestion.clientes.response.AuthResponse;
import com.gestion.clientes.service.UsuarioService;



@TestPropertySource(locations="classpath:test.properties")
@SpringBootTest
public class UsuarioRepositoryTests {

	
    @Autowired
    private UsuarioRepository usuarioRepository;
	
	
	
	@Test
	public void UsuarioRepository_SaveAll_ReturnSavedUsuarios() {
		
		//Arrange
		
			Usuario user = Usuario.builder() 
					.username("John")
					.password("...")
					.name("Jorge")
					.lastname("Godoy")
					.email("jorferafael2569@mail.com")
					.rol(Role.USER) .build();
		
			//Act
			 Usuario usuarioGuardado = usuarioRepository.save(user);		

		
		//Assert
		
		Assertions.assertThat(usuarioGuardado.getIdUsuario()).isGreaterThan(0);
		Assertions.assertThat(usuarioGuardado).isNotNull();

	}
	
}
	
	