/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestion.clientes.controller;

import com.gestion.clientes.model.Usuario;
import com.gestion.clientes.repository.UsuarioRepository;
import com.gestion.clientes.service.UsuarioService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Tomi
 */
@RestController
@RequestMapping("api/v1")
public class UsuarioController {
    
    @Autowired
    UsuarioService usuarioService;
    
    @GetMapping("/usuarios")
    public List<Usuario> listAllUsuarios() {
        return usuarioService.listAllUsuarios();
    }
    
    @PostMapping("/usuarios")
    public Usuario crearUsuario(@Valid @RequestBody Usuario usuario) {
        System.out.println("Datos Recibidos: " + usuario);
        return usuarioService.saveUsuario(usuario);    }
    


@PutMapping("/usuarios/{id}")
public Usuario actualizarUsuario(@PathVariable Long id,@RequestBody Usuario usuarioRequest){
       
    return usuarioService.actualizarUsuario(id, usuarioRequest);

}

@GetMapping("/usuarios/{id}")
public Usuario getUsuarioById(@PathVariable Long id) {
    return usuarioService.getUsuarioById(id);
}




@DeleteMapping("/usuarios/{id}")
void deleteUsuario(@PathVariable Long id){
     usuarioService.deleteUsuario(id);
}







}