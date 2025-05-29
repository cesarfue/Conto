package com.example.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.model.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
  Optional<Organization> findByEmail(String email);

  Optional<Organization> findByName(String name);
}
