package com.apichinh.backend.controller;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public abstract class AdminCrudController<T, ID> {
   protected ResponseEntity<Page<T>> list(JpaRepository<T, ID> repository, int page, int size) {
      Pageable pageable = PageRequest.of(page, size);
      @SuppressWarnings("unchecked")
      Page<T> result = (Page<T>) repository.findAll(pageable);
      return ResponseEntity.ok(result);
   }

   protected ResponseEntity<T> getOne(JpaRepository<T, ID> repository, ID id) {
      Optional<T> item = repository.findById(id);
      return item.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
   }

   protected ResponseEntity<T> create(JpaRepository<T, ID> repository, T entity) {
      return new ResponseEntity<>(repository.save(entity), HttpStatus.CREATED);
   }

   protected ResponseEntity<T> update(JpaRepository<T, ID> repository, ID id, T entity) {
      if (!repository.existsById(id)) {
         return ResponseEntity.notFound().build();
      }
      return ResponseEntity.ok(repository.save(entity));
   }

   protected ResponseEntity<String> delete(JpaRepository<T, ID> repository, ID id) {
      if (!repository.existsById(id)) {
         return ResponseEntity.notFound().build();
      }
      repository.deleteById(id);
      return ResponseEntity.ok("Deleted successfully");
   }
}
