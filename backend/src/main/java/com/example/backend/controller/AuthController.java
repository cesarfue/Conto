package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.model.Association;
import com.example.backend.repository.AssociationRepository;
import com.example.backend.service.GoogleAuthService;
import com.example.backend.service.JwtService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  private AssociationRepository associationRepository;
  @Autowired
  private JwtService jwtService;
  @Autowired
  private GoogleAuthService googleAuthService;

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String password = request.get("password");

    Association association = associationRepository.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

    if (!association.getPassword().equals(password)) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    String token = jwtService.generateToken(email);
    return ResponseEntity.ok(Map.of("token", token));
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String password = request.get("password");

    // Check if user already exists
    if (associationRepository.findByEmail(email).isPresent()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered");
    }

    System.out.println("user registered with credentials: " + email + ", " + password);

    Association newAssociation = new Association();
    newAssociation.setEmail(email);

    // TODO: hash this in prod
    newAssociation.setPassword(password);

    associationRepository.save(newAssociation);

    String token = jwtService.generateToken(email);
    return ResponseEntity.ok(Map.of("token", token));
  }

  @PostMapping("/google")
  public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> request) {
    System.out.println("got post request from frontend");
    String token = request.get("token");

    System.out.println("user registered with google");

    if (token == null || token.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Google token is required");
    }

    String jwtToken = googleAuthService.authenticateGoogleToken(token);

    return ResponseEntity.ok(Map.of(
        "token", jwtToken,
        "message", "Successfully authenticated with Google"));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletRequest request) {
    // Get the Authorization header
    String authHeader = request.getHeader("Authorization");

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      // Extract token
      String token = authHeader.substring(7);

      // You could add the token to a blacklist or perform other invalidation
      // This depends on your JWT implementation

      // For example, if using a token store:
      // tokenStore.revokeToken(token);
    }

    return ResponseEntity.ok(Map.of("message", "Successfully logged out"));
  }
}
