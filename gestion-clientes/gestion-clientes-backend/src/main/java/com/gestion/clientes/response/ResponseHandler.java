/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestion.clientes.response;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
/**
 *
 * @author Tomi
 */
public class ResponseHandler {
    
    public static ResponseEntity<Object> responseBuilder(
    String message, HttpStatus httpStatus, Object responseObject){
    
        String utcIso = DateTimeFormatter.ISO_INSTANT.format(Instant.now());
        Map<String,Object> response = new HashMap<>();
        response.put("message", message);
        response.put("httpStatus", httpStatus);
        response.put("data", responseObject);
        response.put("timestamp", utcIso);
        return new ResponseEntity<>(response, httpStatus);
    
    }
}
