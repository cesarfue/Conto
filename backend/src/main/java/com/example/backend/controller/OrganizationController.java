package com.example.backend.controller;

import com.example.backend.model.Organization;
import com.example.backend.model.User;
import com.example.backend.model.UserOrganization;
import com.example.backend.repository.OrganizationRepository;
import com.example.backend.repository.UserOrganizationRepository;
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
  private UserOrganizationRepository userOrganizationRepository;

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
    organization = organizationRepository.save(organization);

    // Set current organization to false for all user's organizations
    List<UserOrganization> userOrgs = userOrganizationRepository.findByUser(user);
    userOrgs.forEach(uo -> uo.setCurrentOrganization(false));
    userOrganizationRepository.saveAll(userOrgs);

    // Create UserOrganization relationship with admin role
    UserOrganization userOrg = new UserOrganization(user, organization, UserOrganization.UserRole.ADMIN);
    userOrg.setCurrentOrganization(true);
    userOrganizationRepository.save(userOrg);

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

      // Check if user is already a member
      if (userOrganizationRepository.findByUserAndOrganization(user, organization).isPresent()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is already a member of this organization");
      }

      // Set current organization to false for all user's organizations
      List<UserOrganization> userOrgs = userOrganizationRepository.findByUser(user);
      userOrgs.forEach(uo -> uo.setCurrentOrganization(false));
      userOrganizationRepository.saveAll(userOrgs);

      // Create UserOrganization relationship
      UserOrganization userOrg = new UserOrganization(user, organization, UserOrganization.UserRole.MEMBER);
      userOrg.setCurrentOrganization(true);
      userOrganizationRepository.save(userOrg);

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
    UserOrganization userOrg = userOrganizationRepository.findByUserAndOrganization(user,
        organizationRepository.findById(id).orElseThrow())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to this organization"));

    Organization organization = userOrg.getOrganization();

    // Get all members of the organization
    List<UserOrganization> memberOrgs = userOrganizationRepository.findByOrganization(organization);

    List<Map<String, Object>> memberData = memberOrgs.stream()
        .map(memberOrg -> {
          Map<String, Object> memberInfo = new HashMap<>();
          memberInfo.put("id", memberOrg.getUser().getId());
          memberInfo.put("email", memberOrg.getUser().getEmail());
          memberInfo.put("isAdmin", memberOrg.isAdmin());
          return memberInfo;
        })
        .collect(Collectors.toList());

    Map<String, Object> response = new HashMap<>();
    response.put("id", organization.getId());
    response.put("name", organization.getName());
    response.put("members", memberData);
    response.put("isCurrentUserAdmin", userOrg.isAdmin());
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
    UserOrganization userOrg = userOrganizationRepository.findByUserAndOrganization(user, organization)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not a member"));

    if (!userOrg.isAdmin()) {
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
    UserOrganization userOrg = userOrganizationRepository.findByUserAndOrganization(user, organization)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not a member"));

    if (!userOrg.isAdmin()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can send invitations");
    }

    String email = request.get("email");

    // Check if user already exists and is in this organization
    User existingUser = userRepository.findByEmail(email).orElse(null);
    if (existingUser != null) {
      if (userOrganizationRepository.findByUserAndOrganization(existingUser, organization).isPresent()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is already in this organization");
      }
    }

    // In a real application, you would send an email invitation here
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
    UserOrganization currentUserOrg = userOrganizationRepository.findByUserAndOrganization(currentUser, organization)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not a member"));

    if (!currentUserOrg.isAdmin()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can promote members");
    }

    Long userId = Long.valueOf(request.get("userId").toString());
    User userToPromote = userRepository.findById(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    // Check if user belongs to this organization
    UserOrganization userOrgToPromote = userOrganizationRepository
        .findByUserAndOrganization(userToPromote, organization)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a member of this organization"));

    // Promote the user
    userOrgToPromote.setRole(UserOrganization.UserRole.ADMIN);
    userOrganizationRepository.save(userOrgToPromote);

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
    UserOrganization currentUserOrg = userOrganizationRepository.findByUserAndOrganization(currentUser, organization)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not a member"));

    if (!currentUserOrg.isAdmin()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can demote members");
    }

    Long userId = Long.valueOf(request.get("userId").toString());
    User userToDemote = userRepository.findById(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    UserOrganization userOrgToDemote = userOrganizationRepository.findByUserAndOrganization(userToDemote, organization)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a member of this organization"));

    userOrgToDemote.setRole(UserOrganization.UserRole.MEMBER);
    userOrganizationRepository.save(userOrgToDemote);

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
    UserOrganization currentUserOrg = userOrganizationRepository.findByUserAndOrganization(currentUser, organization)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not a member"));

    if (!currentUserOrg.isAdmin()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can remove members");
    }

    User memberToRemove = userRepository.findById(memberId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    // Check if user belongs to this organization
    UserOrganization memberOrgToRemove = userOrganizationRepository
        .findByUserAndOrganization(memberToRemove, organization)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a member of this organization"));

    // Can't remove another admin (you might want to modify this rule)
    if (memberOrgToRemove.isAdmin() && !memberToRemove.getId().equals(currentUser.getId())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot remove another admin");
    }

    // Remove the UserOrganization relationship
    userOrganizationRepository.delete(memberOrgToRemove);

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
    UserOrganization currentUserOrg = userOrganizationRepository.findByUserAndOrganization(currentUser, organization)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not a member"));

    if (!currentUserOrg.isAdmin()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can delete organization");
    }

    // Remove all UserOrganization relationships first
    List<UserOrganization> memberOrgs = userOrganizationRepository.findByOrganization(organization);
    userOrganizationRepository.deleteAll(memberOrgs);

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
