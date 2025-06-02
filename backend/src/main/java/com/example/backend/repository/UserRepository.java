package com.example.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.model.Organization;
import com.example.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

  // Updated method to find users by organization through UserOrganization
  @Query("SELECT uo.user FROM UserOrganization uo WHERE uo.organization = :organization")
  List<User> findByOrganization(@Param("organization") Organization organization);
}
