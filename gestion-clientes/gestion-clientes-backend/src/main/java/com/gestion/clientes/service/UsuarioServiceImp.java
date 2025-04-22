/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestion.clientes.service;

import com.gestion.clientes.exception.ResourceNotFoundException;
import com.gestion.clientes.model.Usuario;
import com.gestion.clientes.repository.UsuarioRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Tomi
 */
@Service
public class UsuarioServiceImp implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Override
    public List<Usuario> listAllUsuarios() {
            return (List<Usuario>)
           usuarioRepository.findAll();
           
    }

    @Override
    public Usuario getUsuarioById(Long id) {

        Usuario existente = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado " + id));
        return existente;
    
    }

    @Override
    public Usuario saveUsuario(Usuario usuario) {
       
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario deleteUsuario(Long id) {
      
          Usuario existente = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado" + id));
          usuarioRepository.deleteById(id);
       return existente;
    }

    @Override
    public Usuario actualizarUsuario(Long id, Usuario usuarioRequest) {

  Usuario existente = usuarioRepository.findById(id)
          .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: "+id));
    
       
          existente.setName(usuarioRequest.getName());
          existente.setLastname(usuarioRequest.getLastname());
          existente.setEmail(usuarioRequest.getEmail());
    return usuarioRepository.save(existente);
   
    }


    
    public Usuario findByUsername(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + username));
    }
	
	
	
}

