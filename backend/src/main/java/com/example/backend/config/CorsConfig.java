package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

  @Bean
  public CorsFilter corsFilter() {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    CorsConfiguration config = new CorsConfiguration();

    // Allow all origins for development (restrict this in production)
    config.addAllowedOrigin("http://localhost:4200");
    config.addAllowedOrigin("https://accounts.google.com");

    // Allow all HTTP methods
    config.addAllowedMethod("*");

    // Allow all headers
    config.addAllowedHeader("*");

    // Allow cookies
    config.setAllowCredentials(true);

    source.registerCorsConfiguration("/**", config);
    return new CorsFilter(source);
  }
}
