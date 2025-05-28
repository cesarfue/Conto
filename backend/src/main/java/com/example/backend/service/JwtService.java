package com.example.backend.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.nio.charset.StandardCharsets;

@Service
public class JwtService {

  private Key key;

  @Value("${jwt.secret}")
  private String secretKey;

  @Value("${jwt.expiration:86400000}")
  private long expirationTime;

  @PostConstruct
  public void init() {
    System.out.println("key is: " + secretKey);
    this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
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
