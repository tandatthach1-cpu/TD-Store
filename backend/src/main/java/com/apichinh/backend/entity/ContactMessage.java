package com.apichinh.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_messages")
public class ContactMessage {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false, length = 120)
   private String name;

   @Column(nullable = true, length = 160)
   private String email;

   @Column(nullable = true, length = 30)
   private String phone;

   @Column(nullable = true, length = 220)
   private String subject;

   @Column(nullable = false, length = 3000)
   private String message;

   @Column(nullable = false)
   private boolean resolved = false;

   @Column(nullable = false)
   private LocalDateTime createdAt;

   @Column(nullable = false)
   private LocalDateTime updatedAt;

   @PrePersist
   public void onCreate() {
      LocalDateTime now = LocalDateTime.now();
      if (this.createdAt == null) {
         this.createdAt = now;
      }
      this.updatedAt = now;
   }

   @PreUpdate
   public void onUpdate() {
      this.updatedAt = LocalDateTime.now();
   }

   public Long getId() {
      return id;
   }

   public void setId(Long id) {
      this.id = id;
   }

   public String getName() {
      return name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public String getEmail() {
      return email;
   }

   public void setEmail(String email) {
      this.email = email;
   }

   public String getPhone() {
      return phone;
   }

   public void setPhone(String phone) {
      this.phone = phone;
   }

   public String getSubject() {
      return subject;
   }

   public void setSubject(String subject) {
      this.subject = subject;
   }

   public String getMessage() {
      return message;
   }

   public void setMessage(String message) {
      this.message = message;
   }

   public boolean isResolved() {
      return resolved;
   }

   public void setResolved(boolean resolved) {
      this.resolved = resolved;
   }

   public LocalDateTime getCreatedAt() {
      return createdAt;
   }

   public void setCreatedAt(LocalDateTime createdAt) {
      this.createdAt = createdAt;
   }

   public LocalDateTime getUpdatedAt() {
      return updatedAt;
   }

   public void setUpdatedAt(LocalDateTime updatedAt) {
      this.updatedAt = updatedAt;
   }
}
