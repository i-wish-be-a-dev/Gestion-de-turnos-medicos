package com.gestion.clientes.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.gestion.clientes.jwt.JwtAuthenticationFilter;

import static org.springframework.security.config.Customizer.withDefaults;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor

public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationnFilter;
    private final AuthenticationProvider authProvider;

	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		
		return http
				.csrf(
						csrf -> csrf.disable())
				.authorizeHttpRequests(authRequest ->
				authRequest
				.requestMatchers("/auth/**").permitAll()
				.requestMatchers("/admin/**").hasAuthority("ADMIN")
				.requestMatchers("/paciente/**").hasAnyAuthority("PACIENTE", "ADMIN")
				.requestMatchers("/doctor/**").hasAnyAuthority("DOCTOR", "ADMIN")
				.anyRequest().authenticated()
				)
				.sessionManagement(sessionManager ->
				sessionManager
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authenticationProvider(authProvider)
				.addFilterBefore(jwtAuthenticationnFilter,UsernamePasswordAuthenticationFilter.class)
				.build();
		
	}
	
	
	

}
//				.AuthenticationProvider(authProvider)
