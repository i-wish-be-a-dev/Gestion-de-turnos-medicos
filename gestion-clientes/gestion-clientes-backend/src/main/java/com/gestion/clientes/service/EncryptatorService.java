package com.gestion.clientes.service;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;


@Service
public class EncryptatorService {

	
	 @Value("${secret-key}")
    private String property;

    public String getProperty() {
    	System.out.println(property);    
    	return property;
    }
    

    public String getPasswordUsingEnvironment(Environment environment) {
      System.out.println(environment.getProperty("secret-key"));    	
    	return environment.getProperty("secret-key");
    }
	
}
