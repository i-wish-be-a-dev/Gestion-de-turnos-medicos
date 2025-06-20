package com.gestion.clientes.jwt;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.gestion.clientes.model.Usuario;

import java.util.function.Function;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;


@Service
public class JwtService {

	    @Value("${secret-key}")
	    private String secretKey;
	
	
	
	public String getSecretKey() {
			return secretKey;
		}

		public void setSecretKey(String secretKey) {
			this.secretKey = secretKey;
		}

	public String getToken(UserDetails user) {
		
		return getToken(new HashMap<>(),user);
	}

	private String getToken(Map<String, Object> extraClaims, UserDetails user) {
		
		return Jwts
				.builder()
				.setClaims(extraClaims)
				.setSubject(user.getUsername())
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis()+1000*60*24))
				.signWith(getKey(), SignatureAlgorithm.HS256)
				.compact();
	}

	private Key getKey() {
		byte[] keyBytes = Decoders.BASE64.decode(this.getSecretKey());
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public String getUsernameFromToken(String token) {
	
		return getClaims(token, Claims::getSubject);
	}

	public boolean isTokenValid(String token, UserDetails userDetails) {
	    try {
	        final String username = getUsernameFromToken(token);
	        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
	    } catch (ExpiredJwtException e) {
	        return false;
	    }
	}

    private Claims getAllClaims(String token)
    {
        return Jwts
            .parserBuilder()
            .setSigningKey(getKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
	
	public <T> T getClaims (String token, Function<Claims,T> claimsResolver){
	
		final Claims claims = getAllClaims(token);
		return claimsResolver.apply(claims);
		
	}

    private Date getExpiration(String token)
    {
        return getClaims(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token)
    {

    return getExpiration(token).before(new Date());
    	

    }
    

	

}
