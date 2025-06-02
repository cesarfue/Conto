package com.example.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.ArrayList;
import java.util.List;

@Entity
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String email;
  private String password;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JsonManagedReference
  private List<UserOrganization> userOrganizations = new ArrayList<>();

  public Organization getCurrentOrganization() {
    return userOrganizations.stream()
        .filter(UserOrganization::isCurrentOrganization)
        .map(UserOrganization::getOrganization)
        .findFirst()
        .orElse(null);
  }

  public boolean hasOrganization() {
    return !userOrganizations.isEmpty();
  }

  public List<Organization> getOrganizations() {
    return userOrganizations.stream()
        .map(UserOrganization::getOrganization)
        .toList();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public List<UserOrganization> getUserOrganizations() {
    return userOrganizations;
  }

  public void setUserOrganizations(List<UserOrganization> userOrganizations) {
    this.userOrganizations = userOrganizations;
  }
}
