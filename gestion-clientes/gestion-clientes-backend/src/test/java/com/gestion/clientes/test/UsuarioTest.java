///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.gestion.clientes.test;
//
//
//import com.gestion.clientes.exception.ResourceNotFoundException;
//import com.gestion.clientes.model.Usuario;
//import com.gestion.clientes.service.UsuarioService;
//import java.util.List;
//import org.junit.jupiter.api.Test;
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.junit.jupiter.api.Assertions.assertThrows;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
///**
// *
// * @author Tomi
// */
//
//@SpringBootTest
//public class UsuarioTest {
//    
//    @Autowired
//    UsuarioService usuarioService;
//    
//    @Test
//    public void testGuardarUsuario(){
//        Usuario usuario = new Usuario("Julian", "Broder", "tomasb@mail.com");
//
//     Usuario usuarioGuardado=   usuarioService.saveUsuario(usuario);
//    assertNotNull(usuarioGuardado);
//    }
//    
//    @Test
//    public void testBuscarUsuarioPorId(){
//    
//        long id = 652;
//       Usuario usuarioConsultado = usuarioService.getUsuarioById(id);
//      assertThat(usuarioConsultado.getIdUsuario()).isEqualTo(id);
//     
//    }
//    @Test
//    public void testBuscarUsuarioInexistentePorId(){
//
//        long id = 000;
//      
//       assertThrows(ResourceNotFoundException.class,
//            () -> {
//            Usuario usuarioConsultado = usuarioService.getUsuarioById(id);
//            });
//    }
//    
//    @Test
//    public void testActualizarUsuario(){
//       String nombreNuevo = "Alberto";
//        Usuario usuarioActualizado = new Usuario("Alberto", "Broder", "tomasb@mail.com");
//      long id = 652;
//      
//     Usuario usuarioGuardado =   usuarioService.getUsuarioById(id);
//     assertNotNull(usuarioGuardado);
//     usuarioGuardado.setNombre(usuarioActualizado.getNombre());
//     usuarioGuardado.setApellido(usuarioActualizado.getApellido());
//     usuarioGuardado.setEmail(usuarioActualizado.getEmail());
//  usuarioService.saveUsuario(usuarioGuardado);
//     usuarioGuardado =   usuarioService.getUsuarioById(id);
//     assertThat(usuarioGuardado.getNombre()).isEqualTo(usuarioActualizado.getNombre());
//      assertThat(usuarioGuardado.getApellido()).isEqualTo(usuarioActualizado.getApellido());
//       assertThat(usuarioGuardado.getEmail()).isEqualTo(usuarioActualizado.getEmail());
//    }  
//    @Test
//    public void testActualizarUsuarioInexistente(){
//  
//        Usuario usuarioActualizado = new Usuario("Alberto", "Broder", "tomasb@mail.com");
//      long id = 000;
//        
//            assertThrows(ResourceNotFoundException.class,
//            () -> {
//               Usuario usuarioGuardado =   usuarioService.getUsuarioById(id);    
//     
//            });
//
//    }  
//    
// @Test
// public void testListarUsuarios(){
// 
//     List<Usuario> usuarios = usuarioService.listAllUsuarios();
//     
//     assertThat(usuarios).size().isGreaterThan(0);
// }
// 
// 
//@Test
//public void testEliminarUsuario() {
//    long id = 702;
//
//    Usuario usuarioAntes = usuarioService.getUsuarioById(id);
//    assertNotNull(usuarioAntes);
//
//    usuarioService.deleteUsuario(id);
//    
//    assertThrows(ResourceNotFoundException.class, () -> {
//        usuarioService.getUsuarioById(id);
//    });
//}
//
// @Test
//public void testEliminarUsuarioInexistente() {
//    long id = 702;
//
//    assertThrows(ResourceNotFoundException.class, () -> {
//         Usuario usuarioAntes = usuarioService.getUsuarioById(id);
//    });
//}   
//
//// ctrl shift C
//
//
//    
//}
