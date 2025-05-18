package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.model.Association;
import com.example.backend.model.User;
import com.example.backend.repository.AssociationRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.JwtService;

@RestController
@RequestMapping("/api/user")
public class UserController {

  @Autowired
  private UserRepository userRepository;
  @Autowired
  private AssociationRepository associationRepository;
  @Autowired
  private JwtService jwtService;

  @GetMapping
  public List<User> getUsers(@RequestHeader("Authorization") String authHeader) {
    String token = authHeader.replace("Bearer ", "");

    System.out.println("got mapping, token is " + token);
    Association association = getAssociationFromToken(token);
    return userRepository.findByAssociation(association);
  }

  @PostMapping
  public ResponseEntity<User> createUser(
      @RequestHeader("Authorization") String authHeader,
      @RequestBody User user) {
    String token = authHeader.replace("Bearer ", "");
    Association association = getAssociationFromToken(token);
    user.setAssociation(association);
    return ResponseEntity.ok(userRepository.save(user));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUser(
      @RequestHeader("Authorization") String authHeader,
      @PathVariable Long id) {
    String token = authHeader.replace("Bearer ", "");
    Association association = getAssociationFromToken(token);
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    if (!user.getAssociation().getId().equals(association.getId())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    userRepository.delete(user);
    return ResponseEntity.ok().build();
  }

  private Association getAssociationFromToken(String token) {
    String email = jwtService.extractSubject(token);
    return associationRepository.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
  }
}
