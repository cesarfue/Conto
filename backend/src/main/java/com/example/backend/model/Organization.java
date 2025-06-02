package com.example.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Organization {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  private String email;

  @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JsonManagedReference
  private List<UserOrganization> userOrganizations = new ArrayList<>();

  @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
  @JsonManagedReference
  private List<Transaction> transactions = new ArrayList<>();

  public List<User> getAdmins() {
    return userOrganizations.stream()
        .filter(uo -> uo.getRole() == UserOrganization.UserRole.ADMIN)
        .map(UserOrganization::getUser)
        .toList();
  }

  public User getAdmin() {
    return userOrganizations.stream()
        .filter(uo -> uo.getRole() == UserOrganization.UserRole.ADMIN)
        .map(UserOrganization::getUser)
        .findFirst()
        .orElse(null);
  }

  public List<User> getUsers() {
    return userOrganizations.stream()
        .map(UserOrganization::getUser)
        .toList();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public List<UserOrganization> getUserOrganizations() {
    return userOrganizations;
  }

  public void setUserOrganizations(List<UserOrganization> userOrganizations) {
    this.userOrganizations = userOrganizations;
  }

  public List<Transaction> getTransactions() {
    return transactions;
  }

  public void setTransactions(List<Transaction> transactions) {
    this.transactions = transactions;
  }
}
