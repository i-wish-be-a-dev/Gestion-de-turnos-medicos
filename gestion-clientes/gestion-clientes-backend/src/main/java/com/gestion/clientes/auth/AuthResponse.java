/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestion.clientes.auth;

;

import lombok.Data;


/**
 *
 * @author Tomi
 */
@Data
public class AuthResponse {
    String token;
    
    public AuthResponse(){}
    public AuthResponse(String token){
    this.token = token;}
    
    public String getToken(){
    return this.token;}
    
    public void setToken(String token){
    this.token = token;}
    
}
