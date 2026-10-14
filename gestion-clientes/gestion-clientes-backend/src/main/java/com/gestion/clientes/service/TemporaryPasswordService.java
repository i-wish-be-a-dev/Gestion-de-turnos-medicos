package com.gestion.clientes.service;

import org.springframework.stereotype.Service;

@Service
public interface TemporaryPasswordService {
    
        String generateTemporalPassword(String username);
}
