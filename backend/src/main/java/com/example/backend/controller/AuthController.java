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
import com.example.backend.service.JwtService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  private AssociationRepository associationRepository;
  @Autowired
  private JwtService jwtService;

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

    Association newAssociation = new Association();
    newAssociation.setEmail(email);
    newAssociation.setPassword(password); // You should hash this in prod

    associationRepository.save(newAssociation);

    String token = jwtService.generateToken(email);
    return ResponseEntity.ok(Map.of("token", token));
  }
}
