package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_organizations")
public class UserOrganization {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(optional = false)
  @JoinColumn(name = "organization_id", nullable = false)
  private Organization organization;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private UserRole role = UserRole.MEMBER;

  @Column(name = "is_current_organization", columnDefinition = "BOOLEAN DEFAULT FALSE")
  private boolean isCurrentOrganization = false;

  @Column(name = "joined_date")
  private LocalDateTime joinedDate = LocalDateTime.now();

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private UserStatus status = UserStatus.ACTIVE;

  public UserOrganization() {
  }

  public UserOrganization(User user, Organization organization, UserRole role) {
    this.user = user;
    this.organization = organization;
    this.role = role;
    this.joinedDate = LocalDateTime.now();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public Organization getOrganization() {
    return organization;
  }

  public void setOrganization(Organization organization) {
    this.organization = organization;
  }

  public UserRole getRole() {
    return role;
  }

  public void setRole(UserRole role) {
    this.role = role;
  }

  public boolean isCurrentOrganization() {
    return isCurrentOrganization;
  }

  public void setCurrentOrganization(boolean currentOrganization) {
    isCurrentOrganization = currentOrganization;
  }

  public LocalDateTime getJoinedDate() {
    return joinedDate;
  }

  public void setJoinedDate(LocalDateTime joinedDate) {
    this.joinedDate = joinedDate;
  }

  public UserStatus getStatus() {
    return status;
  }

  public void setStatus(UserStatus status) {
    this.status = status;
  }

  public boolean isAdmin() {
    return role == UserRole.ADMIN;
  }

  public boolean isActive() {
    return status == UserStatus.ACTIVE;
  }

  public enum UserRole {
    ADMIN,
    MEMBER,
    VIEWER
  }

  public enum UserStatus {
    ACTIVE,
    INACTIVE,
    SUSPENDED
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (!(o instanceof UserOrganization))
      return false;
    UserOrganization that = (UserOrganization) o;
    return user != null && organization != null &&
        user.equals(that.user) && organization.equals(that.organization);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  @Override
  public String toString() {
    return "UserOrganization{" +
        "id=" + id +
        ", user=" + (user != null ? user.getEmail() : "null") +
        ", organization=" + (organization != null ? organization.getName() : "null") +
        ", role=" + role +
        ", isCurrentOrganization=" + isCurrentOrganization +
        ", status=" + status +
        '}';
  }
}
