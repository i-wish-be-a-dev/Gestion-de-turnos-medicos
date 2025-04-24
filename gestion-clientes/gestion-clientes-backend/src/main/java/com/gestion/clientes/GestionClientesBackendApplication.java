package com.gestion.clientes;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;

@EnableEncryptableProperties
@SpringBootApplication
public class GestionClientesBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestionClientesBackendApplication.class, args);
	}

}
