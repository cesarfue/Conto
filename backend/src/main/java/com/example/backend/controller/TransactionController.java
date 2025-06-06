package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.model.Organization;
import com.example.backend.model.Transaction;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.OrganizationRepository;
import com.example.backend.repository.TransactionRepository;
import com.example.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

  @Autowired
  private TransactionRepository transactionRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private OrganizationRepository organizationRepository;

  @Autowired
  private JwtService jwtService;

  @PostMapping
  public ResponseEntity<Transaction> createTransaction(
      @RequestHeader("Authorization") String authHeader,
      @RequestBody Map<String, Object> request) {

    User user = getUserFromToken(authHeader);
    Organization organization = getUserOrganization(user);

    Transaction transaction = new Transaction();
    transaction.setDate(LocalDate.parse((String) request.get("date")));
    transaction.setAmount(new BigDecimal(request.get("amount").toString()));
    transaction.setCategory((String) request.get("category"));
    transaction.setRecipient((String) request.getOrDefault("recipient", ""));
    transaction.setMemo((String) request.getOrDefault("memo", ""));

    transaction.setOrganization(organization);
    transaction.setCreatedBy(user);

    System.out.println("transaction is " + transaction.getOrganization() + transaction.getCreatedBy());
    Transaction savedTransaction = transactionRepository.save(transaction);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedTransaction);
  }

  @GetMapping
  public ResponseEntity<List<Transaction>> getTransactions(
      @RequestHeader("Authorization") String authHeader) {

    User user = getUserFromToken(authHeader);
    Organization organization = getUserOrganization(user);

    // Get all transactions for the organization
    List<Transaction> transactions = transactionRepository.findByOrganizationOrderByDateDesc(organization);

    return ResponseEntity.ok(transactions);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Transaction> updateTransaction(
      @RequestHeader("Authorization") String authHeader,
      @PathVariable Long id,
      @RequestBody Map<String, Object> request) {

    User user = getUserFromToken(authHeader);
    Organization organization = getUserOrganization(user);

    Transaction transaction = transactionRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));

    // Verify the transaction belongs to the user's organization
    if (!transaction.getOrganization().getId().equals(organization.getId())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized to update this transaction");
    }

    transaction.setDate(LocalDate.parse((String) request.get("date")));
    transaction.setAmount(new BigDecimal(request.get("amount").toString()));
    transaction.setCategory((String) request.get("category"));
    transaction.setRecipient((String) request.getOrDefault("recipient", ""));
    transaction.setMemo((String) request.getOrDefault("memo", ""));

    Transaction updatedTransaction = transactionRepository.save(transaction);
    return ResponseEntity.ok(updatedTransaction);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTransaction(
      @RequestHeader("Authorization") String authHeader,
      @PathVariable Long id) {

    User user = getUserFromToken(authHeader);
    Organization organization = getUserOrganization(user);

    Transaction transaction = transactionRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));

    // Verify the transaction belongs to the user's organization
    if (!transaction.getOrganization().getId().equals(organization.getId())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized to delete this transaction");
    }

    System.out.println("transaction deleted");
    transactionRepository.delete(transaction);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/batch")
  public ResponseEntity<Map<String, String>> deleteMultipleTransactions(
      @RequestHeader("Authorization") String authHeader,
      @RequestBody Map<String, List<Long>> request) {

    User user = getUserFromToken(authHeader);
    Organization organization = getUserOrganization(user);
    List<Long> transactionIds = request.get("ids");

    if (transactionIds == null || transactionIds.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No transaction IDs provided");
    }

    List<Transaction> transactions = transactionRepository.findAllById(transactionIds);

    // Verify all transactions belong to the user's organization
    for (Transaction transaction : transactions) {
      if (!transaction.getOrganization().getId().equals(organization.getId())) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
            "Not authorized to delete transaction with ID: " + transaction.getId());
      }
    }

    transactionRepository.deleteAll(transactions);
    return ResponseEntity.ok(Map.of("message", "Transactions deleted successfully"));
  }

  private User getUserFromToken(String authHeader) {
    String token = authHeader.replace("Bearer ", "");
    String email = jwtService.extractSubject(token);
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
  }

  private Organization getUserOrganization(User user) {
    Organization currentOrg = user.getCurrentOrganization();
    if (currentOrg == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "User must be part of an organization to manage transactions");
    }
    return currentOrg;
  }
}
