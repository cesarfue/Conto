package com.example.backend.model;

import jakarta.persistence.*;

@Entity
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  private String role;

  @ManyToOne
  @JoinColumn(name = "association_id")
  private Association association;

  public Association getAssociation() {
    return association;
  }

  public void setAssociation(Association association) {
    this.association = association;
  }

}
