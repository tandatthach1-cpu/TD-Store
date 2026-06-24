package com.apichinh.backend.controller;

import com.apichinh.backend.entity.ContactMessage;
import com.apichinh.backend.repository.ContactMessageRepository;
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
@RequestMapping("/api/contactMessages")
@CrossOrigin(origins = "*", exposedHeaders = { "Content-Range" })
public class ContactMessageController extends AdminCrudController<ContactMessage, Long> {
   private final ContactMessageRepository contactMessageRepository;

   public ContactMessageController(ContactMessageRepository contactMessageRepository) {
      this.contactMessageRepository = contactMessageRepository;
   }

   @GetMapping
   public ResponseEntity<Page<ContactMessage>> getAll(
         @RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "10") int size) {
      return ResponseEntity.ok(contactMessageRepository.findAll(PageRequest.of(page, size)));
   }

   @GetMapping("{id}")
   public ResponseEntity<ContactMessage> getById(@PathVariable Long id) {
      return getOne(contactMessageRepository, id);
   }

   @PostMapping
   public ResponseEntity<ContactMessage> createItem(@RequestBody ContactMessage message) {
      return create(contactMessageRepository, message);
   }

   @PutMapping("{id}")
   public ResponseEntity<ContactMessage> updateItem(@PathVariable Long id, @RequestBody ContactMessage message) {
      message.setId(id);
      return update(contactMessageRepository, id, message);
   }

   @DeleteMapping("{id}")
   public ResponseEntity<String> deleteItem(@PathVariable Long id) {
      return delete(contactMessageRepository, id);
   }
}
