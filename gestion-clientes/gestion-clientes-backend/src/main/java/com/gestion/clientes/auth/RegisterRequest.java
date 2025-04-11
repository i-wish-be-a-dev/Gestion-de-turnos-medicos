/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestion.clientes.auth;

import lombok.Data;
/**
 *
 * @author Tomi
 */
@Data
public class RegisterRequest {
    

    private String username;
    private String password;
    private String nombre;
    private String apellido;
    private String email;
    
    
    
    public RegisterRequest(String username, String password, String nombre, String apellido, String email){
    
        this.username = username;
        this.password = password;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
    }
    
    public RegisterRequest(){}
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }


    public String getPassword() {
      return this.password;
    }
    
      public void setPassword(String password) 
       { this.password = password; }
    

    public String getUsername() {
       return this.username;
    }
         public void setUsername(String username) 
       { this.username = username; }
}