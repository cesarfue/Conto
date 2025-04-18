package com.example.backend.model;

import jakarta.persistence.*;

@Entity
public class Association {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  private String email;
  private String password;

  @OneToMany(mappedBy = "association", cascade = CascadeType.ALL)
  private List<User> users = new ArrayList<>();
}
