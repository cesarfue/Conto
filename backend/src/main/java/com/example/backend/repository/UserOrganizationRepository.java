package com.example.backend.repository;

import com.example.backend.model.Organization;
import com.example.backend.model.User;
import com.example.backend.model.UserOrganization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserOrganizationRepository extends JpaRepository<UserOrganization, Long> {

  List<UserOrganization> findByUser(User user);

  List<UserOrganization> findByOrganization(Organization organization);

  Optional<UserOrganization> findByUserAndOrganization(User user, Organization organization);

  Optional<UserOrganization> findByUserAndIsCurrentOrganizationTrue(User user);

  @Query("SELECT uo FROM UserOrganization uo WHERE uo.user = :user AND uo.role = :role")
  List<UserOrganization> findByUserAndRole(@Param("user") User user,
      @Param("role") UserOrganization.UserRole role);

  @Query("SELECT uo FROM UserOrganization uo WHERE uo.organization = :organization AND uo.role = :role")
  List<UserOrganization> findByOrganizationAndRole(@Param("organization") Organization organization,
      @Param("role") UserOrganization.UserRole role);
}
