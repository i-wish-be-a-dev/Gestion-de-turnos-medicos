/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestion.clientes.auth;

import com.gestion.clientes.Jwt.JwtService;
import com.gestion.clientes.model.Rol;
import com.gestion.clientes.model.Usuario;
import com.gestion.clientes.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
/**
 *
 * @author Tomi
 */
@Service
@RequiredArgsConstructor
class AuthService {
   
    @Autowired
    UsuarioService usuarioService;
    JwtService jwtService;
    
    
    public AuthResponse login(LoginRequest request){
    return null;
    
    
    }
    
    
    public AuthResponse register(RegisterRequest request){
    Usuario user = new Usuario(
        request.getNombre(),
        request.getApellido(),
        request.getEmail(),
        request.getUsername(),
        request.getPassword(),
        Rol.USER
    );
    
usuarioService.saveUsuario(user);

//esto deberia retornar el token
 return  new AuthResponse(jwtService.getToken(user));

    }



}

