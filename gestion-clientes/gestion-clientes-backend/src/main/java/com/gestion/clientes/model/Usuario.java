/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestion.clientes.model;


import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Enumerated;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "usuario",uniqueConstraints = {
        @UniqueConstraint(columnNames = {"username"}),
        @UniqueConstraint(columnNames = {"email"})
    }
)
@Builder
public class Usuario implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "idUsuario", nullable = false)
    private long idUsuario;
    @Column(name = "username")
    private String username;
    @Column(name = "password")
    private String password;
    @Column(name = "name" )
    private String name;
    @Column(name = "lastname")
    private String lastname;
     @Column(name = "email")
    private String email;
     @Enumerated(EnumType.STRING) 
     @Column(name = "rol")
     private Role rol;
     
     @Override
     public Collection<? extends GrantedAuthority> getAuthorities() {
       return List.of(new SimpleGrantedAuthority((rol.name())));
     }
     @Override
     public boolean isAccountNonExpired() {
        return true;
     }
     @Override
     public boolean isAccountNonLocked() {
        return true;
     }
     @Override
     public boolean isCredentialsNonExpired() {
         return true;
     }
     @Override
     public boolean isEnabled() {
         return true;
     }
     


    
     
 	
    
    
 }
