package com.example.backend.repository;

import com.example.backend.model.Organization;
import com.example.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
  List<Transaction> findByOrganizationOrderByDateDesc(Organization organization);

  List<Transaction> findByOrganizationAndCreatedByOrderByDateDesc(Organization organization,
      com.example.backend.model.User createdBy);
}
