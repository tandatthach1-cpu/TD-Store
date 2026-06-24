package com.apichinh.backend.controller;

import com.apichinh.backend.entity.AdminAccount;
import com.apichinh.backend.repository.AdminAccountRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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
@RequestMapping("/api/adminAccounts")
@CrossOrigin(origins = "*", exposedHeaders = { "Content-Range" })
public class AdminAccountController extends AdminCrudController<AdminAccount, Long> {
   private final AdminAccountRepository adminAccountRepository;
   private final PasswordEncoder passwordEncoder;

   public AdminAccountController(AdminAccountRepository adminAccountRepository, PasswordEncoder passwordEncoder) {
      this.adminAccountRepository = adminAccountRepository;
      this.passwordEncoder = passwordEncoder;
   }

   @GetMapping
   public ResponseEntity<Page<AdminAccount>> getAll(
         @RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "10") int size) {
      return ResponseEntity.ok(adminAccountRepository.findAll(PageRequest.of(page, size)));
   }

   @GetMapping("{id}")
   public ResponseEntity<AdminAccount> getById(@PathVariable Long id) {
      return getOne(adminAccountRepository, id);
   }

   @PostMapping
   public ResponseEntity<AdminAccount> createItem(@RequestBody AdminAccount account) {
      if (account.getPassword() != null && !account.getPassword().isBlank()) {
         account.setPassword(passwordEncoder.encode(account.getPassword()));
      }
      return create(adminAccountRepository, account);
   }

   @PutMapping("{id}")
   public ResponseEntity<AdminAccount> updateItem(@PathVariable Long id, @RequestBody AdminAccount account) {
      account.setId(id);
      if (account.getPassword() != null && !account.getPassword().isBlank()) {
         account.setPassword(passwordEncoder.encode(account.getPassword()));
      } else {
         adminAccountRepository.findById(id).ifPresent(existing -> account.setPassword(existing.getPassword()));
      }
      return update(adminAccountRepository, id, account);
   }

   @DeleteMapping("{id}")
   public ResponseEntity<String> deleteItem(@PathVariable Long id) {
      return delete(adminAccountRepository, id);
   }
}
