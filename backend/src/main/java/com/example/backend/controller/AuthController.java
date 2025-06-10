package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.model.User;
import com.example.backend.model.Organization;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.GoogleAuthService;
import com.example.backend.service.JwtService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  private UserRepository userRepository;
  @Autowired
  private JwtService jwtService;
  @Autowired
  private GoogleAuthService googleAuthService;

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String password = request.get("password");

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Email not found"));

    if (!user.getPassword().equals(password)) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
    }

    String token = jwtService.generateToken(email);
    return ResponseEntity.ok(Map.of("token", token));
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String password = request.get("password");

    // Check if user already exists
    if (userRepository.findByEmail(email).isPresent()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered");
    }

    System.out.println("user registered with credentials: " + email + ", " + password);

    User newUser = new User();
    newUser.setEmail(email);
    newUser.setPassword(password);

    userRepository.save(newUser);

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
    String authHeader = request.getHeader("Authorization");

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      String token = authHeader.substring(7);
    }

    return ResponseEntity.ok(Map.of("message", "Successfully logged out"));
  }

  @GetMapping("/status")
  public ResponseEntity<?> getUserStatus(@RequestHeader("Authorization") String authHeader) {
    String token = authHeader.replace("Bearer ", "");
    String email = jwtService.extractSubject(token);

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

    Map<String, Object> response = new HashMap<>();
    response.put("email", user.getEmail());
    response.put("hasOrganization", user.hasOrganization());

    // Get current organization
    Organization currentOrg = user.getCurrentOrganization();
    response.put("currentOrganizationId", currentOrg != null ? currentOrg.getId() : null);
    response.put("currentOrganizationName", currentOrg != null ? currentOrg.getName() : null);

    // Get all organizations
    List<Map<String, Object>> organizations = user.getUserOrganizations().stream()
        .map(uo -> {
          Map<String, Object> org = new HashMap<>();
          org.put("id", uo.getOrganization().getId());
          org.put("name", uo.getOrganization().getName());
          org.put("role", uo.getRole().toString());
          org.put("isCurrent", uo.isCurrentOrganization());
          return org;
        })
        .collect(Collectors.toList());

    response.put("organizations", organizations);
    return ResponseEntity.ok(response);
  }
}
