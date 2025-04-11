/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestion.clientes.config;

import com.gestion.clientes.exception.ResourceNotFoundException;
import com.gestion.clientes.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
/**
 *
 * @author Tomi
 */
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration
public class ApplicationConfig {
    
    
    @Autowired
    UsuarioRepository usuarioRepositorio;
    
    
    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception
    {
        return config.getAuthenticationManager();
    }
    @Bean
        public AuthenticationProvider authtenticationProvider (AuthenticationConfiguration config) throws Exception
    {
        DaoAuthenticationProvider authtenticationProvider = new DaoAuthenticationProvider();
        authtenticationProvider.setUserDetailsService(userDetailsService());
        authtenticationProvider.setPasswordEncoder(passwordEncoder());
        return  authtenticationProvider;
        
    }
       @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> usuarioRepositorio.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    
    
}
