package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
  private final UserRepository userRepo;

  public UserController(UserRepository userRepo) {
    this.userRepo = userRepo;
  }

  @GetMapping
  public List<User> getAllUser() {
    return userRepo.findAll();
  }

  @PostMapping
  public User createUser(@RequestBody User user) {
    return userRepo.save(user);
  }
}

