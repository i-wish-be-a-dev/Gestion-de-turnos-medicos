package com.gestion.clientes.test;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Base64;
import java.util.Date;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import com.gestion.clientes.jwt.JwtService;


@ExtendWith(MockitoExtension.class)
public class JwtTest {

	@InjectMocks
	private JwtService jwtService;
	
	
	@Mock
	private UserDetails userDetails;
	
	
	@BeforeEach
	void setUp() {
		
		jwtService.setSecretKey(Base64.getEncoder().encodeToString("claveSecreta123456789123456789123456789123456789".getBytes()));
	
	}
	
	@Test
	void shouldGenerateValidToken() {
		Mockito.when(userDetails.getUsername()).thenReturn("testUser");
		String token = jwtService.getToken(userDetails);
		
		Assertions.assertNotNull(token);
		Assertions.assertTrue(jwtService.isTokenValid(token, userDetails));
		Assertions.assertEquals("testUser", jwtService.getUsernameFromToken(token));
	}
	
	
	
	@Test
	void shouldDetectExpiredToken(){
		
		   String expiredToken = Jwts.builder()
		            .setSubject("testUser")
		            .setIssuedAt(new Date(System.currentTimeMillis() - 1000 * 60 * 60)) 
		            .setExpiration(new Date(System.currentTimeMillis() - 1000 * 30)) 
		            .signWith(Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtService.getSecretKey())), SignatureAlgorithm.HS256)
		            .compact();

		    boolean isValid = jwtService.isTokenValid(expiredToken, userDetails);

		    assertFalse(isValid);
	}
        

	
	
	
	
	
	
}
