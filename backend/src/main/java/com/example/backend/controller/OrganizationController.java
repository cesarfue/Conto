package com.example.backend.controller;

import com.example.backend.model.Organization;
import com.example.backend.model.User;
import com.example.backend.repository.OrganizationRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

  @Autowired
  private OrganizationRepository organizationRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private JwtService jwtService;

  @PostMapping("/create")
  public ResponseEntity<?> createOrganization(
      @RequestHeader("Authorization") String authHeader,
      @RequestBody Map<String, String> request) {

    User user = getUserFromToken(authHeader);
    String name = request.get("name");

    Organization organization = new Organization();
    organization.setName(name);
    organization.setAdmin(user);
    organization = organizationRepository.save(organization);

    user.setOrganization(organization);
    userRepository.save(user);

    return ResponseEntity.ok(Map.of(
        "message", "Organization created successfully",
        "organizationId", organization.getId(),
        "joinCode", "ORG-" + organization.getId()));
  }

  @PostMapping("/join")
  public ResponseEntity<?> joinOrganization(
      @RequestHeader("Authorization") String authHeader,
      @RequestBody Map<String, String> request) {

    User user = getUserFromToken(authHeader);
    String joinCode = request.get("joinCode");

    if (!joinCode.startsWith("ORG-")) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid join code");
    }

    try {
      Long orgId = Long.parseLong(joinCode.substring(4));
      Organization organization = organizationRepository.findById(orgId)
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));

      user.setOrganization(organization);
      userRepository.save(user);

      return ResponseEntity.ok(Map.of("message", "Successfully joined organization"));
    } catch (NumberFormatException e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid join code format");
    }
  }

  private User getUserFromToken(String authHeader) {
    String token = authHeader.replace("Bearer ", "");
    String email = jwtService.extractSubject(token);
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
  }
}
