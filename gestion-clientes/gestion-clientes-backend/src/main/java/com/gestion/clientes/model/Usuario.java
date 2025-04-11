/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestion.clientes.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Collection;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


@Data
@Entity
//@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuario")
public class Usuario implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "idUsuario")
    private long idUsuario;
    
    @Column(name = "username", nullable = false )
    private String username;
    
    @Column(name = "password" )
    private String password;
    
    @Column(name = "nombre" )
    private String nombre;
    @Column(name = "apellido")
    private String apellido;
     @Column(name = "email")
    private String email;
     @Column (name = "rol")
     private Rol rol;

    public Usuario(String nombre, String apellido, String email) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
    }

    public Usuario() {
    }

    public Usuario(long idUsuario, String nombre, String apellido, String email, String username, String password, Rol rol) {
        this.idUsuario = idUsuario;
        this.username = username;
        this.password = password;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.rol = rol;
    }
    
    public Usuario(String nombre, String apellido, String email, String username, String password, Rol rol) {
        this.username = username;
        this.password = password;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.rol = rol;
    }
    
//    public Rol getRol() {
//        return rol;
//    }
//
//    public void setRol(Rol rol) {
//        this.rol = rol;
//    }
//    
//    
//    public long getIdUsuario() { return idUsuario; }
//    public void setIdUsuario(long idUsuario) { this.idUsuario = idUsuario; }
//
//    public String getNombre() { return nombre; }
//    public void setNombre(String nombre) { this.nombre = nombre; }
//
//    public String getApellido() { return apellido; }
//    public void setApellido(String apellido) { this.apellido = apellido; }
//
//    public String getEmail() { return email; }
//    public void setEmail(String email) { this.email = email; }

    @Override
    public String getPassword() {
      return this.password;
    }
    
      public void setPassword(String password) 
       { this.password = password; }
    
    @Override
    public String getUsername() {
       return this.username;
    }
         public void setUsername(String username) 
       { this.username = username; }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority((this.rol.name())));
    
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