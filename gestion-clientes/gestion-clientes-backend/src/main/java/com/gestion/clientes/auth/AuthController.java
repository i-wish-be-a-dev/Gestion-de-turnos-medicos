/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestion.clientes.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Tomi
 */
@RestController
@RequestMapping("auth/")
@RequiredArgsConstructor
public class AuthController {
    
    @PostMapping(value = "login")
    public String login(){
        return "Logeado desde un endpoint publico";
    }
    
    @PostMapping(value = "register")
    public String register(){
        return "Registrado desde un endpoint publico";
    }    
    
    
    
}
