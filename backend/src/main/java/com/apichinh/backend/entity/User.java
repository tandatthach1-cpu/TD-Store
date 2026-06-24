package com.apichinh.backend.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
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
@Table(name = "users")
public class User {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false, unique = true)
   private String username;

   @Column(nullable = true, length = 120)
   private String fullName;

   @Column(nullable = true)
   private String numphone;

   @Column(nullable = true)
   private String email;

   @Column(nullable = true)
   private String photo;

   @Column(nullable = false)
   @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
   private String pass;

   @Column(nullable = false, length = 30)
   private String role = "CUSTOMER";

   @Column(nullable = false)
   private boolean active = true;

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
      return this.id;
   }

   public String getUsername() {
      return this.username;
   }

   public String getFullName() {
      return fullName;
   }

   public String getNumphone() {
      return this.numphone;
   }

   public String getEmail() {
      return this.email;
   }

   public String getPhoto() {
      return this.photo;
   }

   public String getPass() {
      return this.pass;
   }

   public String getRole() {
      return role;
   }

   public boolean isActive() {
      return active;
   }

   public LocalDateTime getCreatedAt() {
      return createdAt;
   }

   public LocalDateTime getUpdatedAt() {
      return updatedAt;
   }

   public void setId(final Long id) {
      this.id = id;
   }

   public void setUsername(final String username) {
      this.username = username;
   }

   public void setFullName(String fullName) {
      this.fullName = fullName;
   }

   public void setNumphone(final String numphone) {
      this.numphone = numphone;
   }

   public void setEmail(final String email) {
      this.email = email;
   }

   public void setPhoto(final String photo) {
      this.photo = photo;
   }

   public void setPass(final String pass) {
      this.pass = pass;
   }

   public void setRole(String role) {
      this.role = role;
   }

   public void setActive(boolean active) {
      this.active = active;
   }

   public void setCreatedAt(LocalDateTime createdAt) {
      this.createdAt = createdAt;
   }

   public void setUpdatedAt(LocalDateTime updatedAt) {
      this.updatedAt = updatedAt;
   }

   public User() {
   }

   public User(final Long id, final String username, final String numphone, final String email,
         final String photo, final String pass) {
      this.id = id;
      this.username = username;
      this.numphone = numphone;
      this.email = email;
      this.photo = photo;
      this.pass = pass;
   }
}
