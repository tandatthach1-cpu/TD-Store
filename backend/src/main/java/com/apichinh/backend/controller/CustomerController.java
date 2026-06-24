package com.apichinh.backend.controller;

import com.apichinh.backend.entity.User;
import com.apichinh.backend.repository.UserRepository;
import com.apichinh.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*", exposedHeaders = { "Content-Range" })
public class CustomerController extends AdminCrudController<User, Long> {
   private final UserRepository userRepository;
   private final UserService userService;

   public CustomerController(UserRepository userRepository, UserService userService) {
      this.userRepository = userRepository;
      this.userService = userService;
   }

   @GetMapping
   public ResponseEntity<Page<User>> getAll(
         @RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "10") int size) {
      return ResponseEntity.ok(userRepository.findByRole("CUSTOMER", PageRequest.of(page, size)));
   }

   @GetMapping("{id}")
   public ResponseEntity<User> getById(@PathVariable Long id) {
      return getOne(userRepository, id);
   }

   @PostMapping
   public ResponseEntity<User> createItem(@RequestBody User user) {
      user.setRole("CUSTOMER");
      return ResponseEntity.status(201).body(userService.createUser(user));
   }

   @PutMapping("{id}")
   public ResponseEntity<User> updateItem(@PathVariable Long id, @RequestBody User user) {
      user.setId(id);
      user.setRole("CUSTOMER");
      return ResponseEntity.ok(userService.updateUser(user));
   }

   @DeleteMapping("{id}")
   public ResponseEntity<String> deleteItem(@PathVariable Long id) {
      return delete(userRepository, id);
   }
}
