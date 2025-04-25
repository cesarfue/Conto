package com.example.backend.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

  private static final String SECRET = "very_secret_key_which_should_be_long_enough_to_be_secure";
  private static final long EXPIRATION_TIME = 86400000; // 1 day in ms

  private Key key;

  @PostConstruct
  public void init() {
    this.key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
  }

  public String generateToken(String subject) {
    return Jwts.builder()
        .setSubject(subject)
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public String validateTokenAndGetSubject(String token) throws JwtException {
    return Jwts.parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
  }

  public String extractSubject(String token) throws JwtException {
    return validateTokenAndGetSubject(token);
  }
}
