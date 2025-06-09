/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestion.clientes.service;

import com.gestion.clientes.model.Usuario;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public interface UsuarioService {

    List<Usuario> listAllUsuarios();

    Usuario getUsuarioById(Long id);
    
    Usuario actualizarUsuario(Long id, Usuario usuarioRequest);

    Usuario saveUsuario(Usuario usuario);

    Usuario deleteUsuario(Long id);
    
    Usuario findByUsername(String username); 

    Usuario changeRoleToPaciente(Long id);

    Usuario changeRoleToDoctor(Long id);
    
    Usuario changeRoleToAdmin(Long id);
    
}
