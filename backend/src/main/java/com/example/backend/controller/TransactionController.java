package com.example.backend.controller;

import com.example.backend.model.Association;
import com.example.backend.model.Transaction;
import com.example.backend.repository.AssociationRepository;
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
  private AssociationRepository associationRepository;

  @Autowired
  private JwtService jwtService;

  @PostMapping
  public ResponseEntity<Transaction> createTransaction(
      @RequestHeader("Authorization") String authHeader,
      @RequestBody Map<String, Object> request) {

    Association association = getAssociationFromToken(authHeader);

    Transaction transaction = new Transaction();
    transaction.setDate(LocalDate.parse((String) request.get("date")));
    transaction.setAmount(new BigDecimal(request.get("amount").toString()));
    transaction.setCategory((String) request.get("category"));
    transaction.setRecipient((String) request.getOrDefault("recipient", ""));
    transaction.setMemo((String) request.getOrDefault("memo", ""));
    transaction.setAssociation(association);

    Transaction savedTransaction = transactionRepository.save(transaction);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedTransaction);
  }

  @GetMapping
  public ResponseEntity<List<Transaction>> getTransactions(
      @RequestHeader("Authorization") String authHeader) {

    Association association = getAssociationFromToken(authHeader);
    List<Transaction> transactions = transactionRepository.findByAssociationOrderByDateDesc(association);

    return ResponseEntity.ok(transactions);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Transaction> updateTransaction(
      @RequestHeader("Authorization") String authHeader,
      @PathVariable Long id,
      @RequestBody Map<String, Object> request) {

    Association association = getAssociationFromToken(authHeader);

    Transaction transaction = transactionRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));

    // Verify ownership
    if (!transaction.getAssociation().getId().equals(association.getId())) {
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

    Association association = getAssociationFromToken(authHeader);

    Transaction transaction = transactionRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));

    // Verify ownership
    if (!transaction.getAssociation().getId().equals(association.getId())) {
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

    Association association = getAssociationFromToken(authHeader);
    List<Long> transactionIds = request.get("ids");

    if (transactionIds == null || transactionIds.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No transaction IDs provided");
    }

    List<Transaction> transactions = transactionRepository.findAllById(transactionIds);

    // Verify all transactions belong to the association
    for (Transaction transaction : transactions) {
      if (!transaction.getAssociation().getId().equals(association.getId())) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
            "Not authorized to delete transaction with ID: " + transaction.getId());
      }
    }

    transactionRepository.deleteAll(transactions);
    return ResponseEntity.ok(Map.of("message", "Transactions deleted successfully"));
  }

  private Association getAssociationFromToken(String authHeader) {
    String token = authHeader.replace("Bearer ", "");
    String email = jwtService.extractSubject(token);
    return associationRepository.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
  }
}
