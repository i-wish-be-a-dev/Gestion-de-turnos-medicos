package com.gestion.clientes.test.service;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.assertj.core.api.Assertions;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import static org.junit.jupiter.api.Assertions.assertAll;
import com.gestion.clientes.model.Role;
import com.gestion.clientes.model.Usuario;
import com.gestion.clientes.repository.UsuarioRepository;
import com.gestion.clientes.service.UsuarioServiceImp;


@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {

	@Mock
	private UsuarioRepository usuarioRepository;
	
	
	@InjectMocks
	private UsuarioServiceImp usuarioService;
	
	
	@Test 
	public void UsuarioService_CreateUsuario_ReturnsUsuario() {
		Usuario user = Usuario.builder() 
				.username("John")
				.password("...")
				.name("Jorge")
				.lastname("Godoy")
				.email("jorferafael2569@mail.com")
				.rol(Role.USER) .build();
		
	when(usuarioRepository.save(Mockito.any(Usuario.class))).thenReturn(user);
	
	Usuario savedUser = usuarioService.saveUsuario(user);
	
	Assertions.assertThat(savedUser).isNotNull();
	
	}
	
	@Test
	public void UsuarioService_GetAllUsuarios_ReturnUsuario() {
		//ARRANGE
		Usuario user = Usuario.builder() 
				.username("John")
				.password("...")
				.name("Jorge")
				.lastname("Godoy")
				.email("jorferafael2569@mail.com")
				.rol(Role.USER) .build();
		

		Usuario user2 = Usuario.builder() 
				.username("Garfield")
				.password("...")
				.name("Tomas")
				.lastname("Broder")
				.email("tomasbroder2222@mail.com")
				.rol(Role.USER) .build();
		
		
		List<Usuario> mockUsuarios = List.of(user,user2);
		
		when (usuarioService.listAllUsuarios()).thenReturn(mockUsuarios);
		
		//Act
	List <Usuario> usuarios = usuarioService.listAllUsuarios();
		
		//Assert
	Assertions.assertThat(usuarios).isNotNull();
	Assertions.assertThat(usuarios.size()).isGreaterThan(1);
	Assertions.assertThat(usuarios.get(0).getUsername()).isEqualTo("John");
	Assertions.assertThat(usuarios.get(1).getUsername()).isEqualTo("Garfield");

	}
	
    @Test
    public void UsuarioService_DeleteUsuarioById() {
        // Arrange
        long idUsuario = 1;

        Usuario usuario = Usuario.builder()
                .idUsuario(idUsuario)
                .username("Garfield")
                .password("...")
                .name("Tomas")
                .lastname("Broder")
                .email("tomasbroder2222@mail.com")
                .rol(Role.USER)
                .build();

        
        when(usuarioRepository.findById(idUsuario)).thenReturn(Optional.ofNullable(usuario));

   
        assertAll(() -> usuarioService.deleteUsuario(idUsuario));
    }
	
	public void UsuarioService_UpdateUsuario() {
		
		 long idUsuario = 1;
		 
		 
	        Usuario usuario = Usuario.builder()
	                .idUsuario(idUsuario)
	                .username("Garfield")
	                .password("...")
	                .name("Tomas")
	                .lastname("Broder")
	                .email("tomasbroder2222@mail.com")
	                .rol(Role.USER)
	                .build();
		 
		 
		 
		
	}
    
    
    
    
	
	
	
	
}

