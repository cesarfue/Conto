
package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // Optional: disable CSRF for APIs
            .authorizeHttpRequests()
            .requestMatchers("/api/**").permitAll() // ✅ allow public access to /api/**
            .anyRequest().authenticated()
            .and()
            .httpBasic(); // Optional: default login form for other routes

        return http.build();
    }
}
