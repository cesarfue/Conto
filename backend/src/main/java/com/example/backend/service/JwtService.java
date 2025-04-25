package com.example.backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.JwtException;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

  private static final String SECRET = "very_secret_key"; // Replace with env variable in production
  private static final long EXPIRATION_TIME = 86400000; // 1 day in milliseconds

  public String generateToken(String subject) {
    return Jwts.builder()
        .setSubject(subject)
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .signWith(SignatureAlgorithm.HS256, SECRET)
        .compact();
  }

  public String validateTokenAndGetSubject(String token) throws JwtException {
    return Jwts.parser()
        .setSigningKey(SECRET)
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
  }

  public String extractSubject(String token) {
    return Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody().getSubject();
  }
}
