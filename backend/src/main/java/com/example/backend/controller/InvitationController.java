package com.example.backend.controller;

import com.example.backend.model.Association;
import com.example.backend.model.Invitation;
import com.example.backend.model.User;
import com.example.backend.repository.AssociationRepository;
import com.example.backend.repository.InvitationRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/invitations")
public class InvitationController {

  @Autowired
  private InvitationRepository invitationRepository;
  @Autowired
  private AssociationRepository associationRepository;
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private JwtService jwtService;

  @PostMapping
  public ResponseEntity<?> sendInvitation(
      @RequestHeader("Authorization") String authHeader,
      @RequestBody Map<String, String> request) {
    String token = authHeader.replace("Bearer ", "");
    String targetEmail = request.get("email");

    Association senderAssociation = associationRepository
        .findByEmail(jwtService.extractSubject(token))
        .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED));

    Optional<Invitation> existing = invitationRepository.findByEmail(targetEmail);
    if (existing.isPresent()) {
      throw new ResponseStatusException(BAD_REQUEST, "User already invited");
    }

    Invitation invitation = new Invitation();
    invitation.setEmail(targetEmail);
    invitation.setAssociation(senderAssociation);
    invitationRepository.save(invitation);

    return ResponseEntity.ok(Map.of("message", "Invitation sent"));
  }

  @PostMapping("/accept")
  public ResponseEntity<?> acceptInvitation(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String name = request.get("name");
    String role = request.get("role");

    Invitation invitation = invitationRepository.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "No invitation found"));

    User user = new User();
    user.setName(name);
    user.setRole(role);
    user.setAssociation(invitation.getAssociation());
    userRepository.save(user);

    invitationRepository.delete(invitation);

    return ResponseEntity.ok(Map.of("message", "User registered to association"));
  }
}
