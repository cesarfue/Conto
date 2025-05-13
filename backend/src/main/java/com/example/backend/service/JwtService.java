package com.example.backend.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

  private Key key;

  @Value("${jwt.expiration:86400000}")
  private long expirationTime;

  @PostConstruct
  public void init() {
    this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
  }

  public String generateToken(String subject) {
    return Jwts.builder()
        .setSubject(subject)
        .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
        .signWith(key)
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
