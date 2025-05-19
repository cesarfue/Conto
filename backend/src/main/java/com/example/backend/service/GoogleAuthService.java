package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.example.backend.model.Association;
import com.example.backend.repository.AssociationRepository;

import java.io.IOException;
import java.security.GeneralSecurityException;

@Service
public class GoogleAuthService {

  @Autowired
  private GoogleIdTokenVerifier verifier;

  @Autowired
  private AssociationRepository associationRepository;

  @Autowired
  private JwtService jwtService;

  public String authenticateGoogleToken(String idTokenString) {
    try {
      GoogleIdToken idToken = verifier.verify(idTokenString);
      if (idToken == null) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token");
      }

      Payload payload = idToken.getPayload();

      // Get profile information from payload
      String email = payload.getEmail();
      boolean emailVerified = payload.getEmailVerified();
      String name = (String) payload.get("name");
      String pictureUrl = (String) payload.get("picture");

      if (!emailVerified) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email not verified by Google");
      }

      // Check if user exists in your database
      Association association = associationRepository.findByEmail(email)
          .orElseGet(() -> {
            // Create a new user if they don't exist
            Association newAssociation = new Association();
            newAssociation.setEmail(email);
            // Generate a secure random password since they'll be logging in with Google
            newAssociation.setPassword(generateSecureRandomPassword());
            // You could also save the name and picture URL
            return associationRepository.save(newAssociation);
          });

      // Generate JWT token for the authenticated user
      return jwtService.generateToken(email);

    } catch (GeneralSecurityException | IOException e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
          "Error verifying Google token: " + e.getMessage());
    }
  }

  private String generateSecureRandomPassword() {
    // Generate a secure random password for Google users
    // This is just a placeholder - implement proper secure random generation
    return java.util.UUID.randomUUID().toString();
  }
}
