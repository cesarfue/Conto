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

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  @ManyToOne
  @JoinColumn(name = "admin_id")
  private User admin;

  @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
  @JsonManagedReference
  private List<User> users = new ArrayList<>();

  @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
  @JsonManagedReference
  private List<Transaction> transactions = new ArrayList<>();

  public List<Transaction> getTransactions() {
    return transactions;
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

  public List<User> getUsers() {
    return users;
  }

  public void setUsers(List<User> users) {
    this.users = users;
  }

  public User getAdmin() {
    return admin;
  }

  public void setAdmin(User admin) {
    this.admin = admin;
  }
}
