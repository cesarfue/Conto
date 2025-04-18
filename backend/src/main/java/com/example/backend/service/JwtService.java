package com.yourproject.service;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Service;

import com.sun.org.apache.xml.internal.security.algorithms.SignatureAlgorithm;

import java.util.Date;

@Service
public class JwtService {
  private final String SECRET = "mySecretKey";
  private final long EXPIRATION_TIME = 86400000; // 1 day

  public String generateToken(String email) {
    return Jwts.builder()
        .setSubject(email)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .signWith(SignatureAlgorithm.HS256, SECRET)
        .compact();
  }

  public String extractSubject(String token) {
    return Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody().getSubject();
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token);
      return true;
    } catch (JwtException e) {
      return false;
    }
  }
}
