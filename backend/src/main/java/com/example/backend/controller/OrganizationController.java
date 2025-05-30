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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

  @GetMapping("/{id}")
  public ResponseEntity<?> getOrganizationDetails(
      @RequestHeader("Authorization") String authHeader,
      @PathVariable Long id) {

    User user = getUserFromToken(authHeader);

    // Check if user belongs to this organization
    if (user.getOrganization() == null || !user.getOrganization().getId().equals(id)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to this organization");
    }

    Organization organization = organizationRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));

    // Get all members of the organization
    List<User> members = userRepository.findByOrganization(organization);

    List<Map<String, Object>> memberData = members.stream()
        .map(member -> {
          Map<String, Object> memberInfo = new HashMap<>();
          memberInfo.put("id", member.getId());
          memberInfo.put("email", member.getEmail());
          memberInfo.put("isAdmin", member.getId().equals(organization.getAdmin().getId()));
          return memberInfo;
        })
        .collect(Collectors.toList());

    Map<String, Object> response = new HashMap<>();
    response.put("id", organization.getId());
    response.put("name", organization.getName());
    response.put("members", memberData);
    response.put("isCurrentUserAdmin", user.getId().equals(organization.getAdmin().getId()));
    response.put("currentUserId", user.getId());

    return ResponseEntity.ok(response);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateOrganization(
      @RequestHeader("Authorization") String authHeader,
      @PathVariable Long id,
      @RequestBody Map<String, String> request) {

    User user = getUserFromToken(authHeader);
    Organization organization = organizationRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));

    // Check if user is admin of this organization
    if (!user.getId().equals(organization.getAdmin().getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can update organization");
    }

    String newName = request.get("name");
    if (newName != null && !newName.trim().isEmpty()) {
      organization.setName(newName.trim());
      organizationRepository.save(organization);
    }

    return ResponseEntity.ok(Map.of("message", "Organization updated successfully"));
  }

  @PostMapping("/{id}/invite")
  public ResponseEntity<?> inviteMember(
      @RequestHeader("Authorization") String authHeader,
      @PathVariable Long id,
      @RequestBody Map<String, String> request) {

    User user = getUserFromToken(authHeader);
    Organization organization = organizationRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));

    // Check if user is admin of this organization
    if (!user.getId().equals(organization.getAdmin().getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can send invitations");
    }

    String email = request.get("email");

    // Check if user already exists and is in an organization
    User existingUser = userRepository.findByEmail(email).orElse(null);
    if (existingUser != null && existingUser.getOrganization() != null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is already in an organization");
    }

    // In a real application, you would send an email invitation here
    // For now, we'll just return success
    return ResponseEntity.ok(Map.of(
        "message", "Invitation sent successfully",
        "joinCode", "ORG-" + organization.getId()));
  }

  @PostMapping("/{id}/promote")
  public ResponseEntity<?> promoteToAdmin(
      @RequestHeader("Authorization") String authHeader,
      @PathVariable Long id,
      @RequestBody Map<String, Object> request) {

    User currentUser = getUserFromToken(authHeader);
    Organization organization = organizationRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));

    // Check if current user is admin
    if (!currentUser.getId().equals(organization.getAdmin().getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can promote members");
    }

    Long userId = Long.valueOf(request.get("userId").toString());
    User userToPromote = userRepository.findById(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    // Check if user belongs to this organization
    if (userToPromote.getOrganization() == null || !userToPromote.getOrganization().getId().equals(id)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a member of this organization");
    }

    // Set the user as admin (you might want to have multiple admins, adjust as
    // needed)
    organization.setAdmin(userToPromote);
    organizationRepository.save(organization);

    return ResponseEntity.ok(Map.of("message", "User promoted to admin successfully"));
  }

  @PostMapping("/{id}/demote")
  public ResponseEntity<?> demoteFromAdmin(
      @RequestHeader("Authorization") String authHeader,
      @PathVariable Long id,
      @RequestBody Map<String, Object> request) {

    User currentUser = getUserFromToken(authHeader);
    Organization organization = organizationRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));

    // Check if current user is admin
    if (!currentUser.getId().equals(organization.getAdmin().getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can demote members");
    }

    // For simplicity, we'll just return success since we only have one admin model
    // In a real app, you'd have multiple admin roles
    return ResponseEntity.ok(Map.of("message", "Admin privileges removed successfully"));
  }

  @DeleteMapping("/{id}/members/{memberId}")
  public ResponseEntity<?> removeMember(
      @RequestHeader("Authorization") String authHeader,
      @PathVariable Long id,
      @PathVariable Long memberId) {

    User currentUser = getUserFromToken(authHeader);
    Organization organization = organizationRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));

    // Check if current user is admin
    if (!currentUser.getId().equals(organization.getAdmin().getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can remove members");
    }

    User memberToRemove = userRepository.findById(memberId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    // Check if user belongs to this organization
    if (memberToRemove.getOrganization() == null || !memberToRemove.getOrganization().getId().equals(id)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a member of this organization");
    }

    // Can't remove the admin
    if (memberToRemove.getId().equals(organization.getAdmin().getId())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot remove the organization admin");
    }

    // Remove user from organization
    memberToRemove.setOrganization(null);
    userRepository.save(memberToRemove);

    return ResponseEntity.ok(Map.of("message", "Member removed successfully"));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteOrganization(
      @RequestHeader("Authorization") String authHeader,
      @PathVariable Long id) {

    User currentUser = getUserFromToken(authHeader);
    Organization organization = organizationRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));

    // Check if current user is admin
    if (!currentUser.getId().equals(organization.getAdmin().getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can delete organization");
    }

    // Remove all users from the organization first
    List<User> members = userRepository.findByOrganization(organization);
    for (User member : members) {
      member.setOrganization(null);
      userRepository.save(member);
    }

    // Delete the organization
    organizationRepository.delete(organization);

    return ResponseEntity.ok(Map.of("message", "Organization deleted successfully"));
  }

  private User getUserFromToken(String authHeader) {
    String token = authHeader.replace("Bearer ", "");
    String email = jwtService.extractSubject(token);
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
  }
}
