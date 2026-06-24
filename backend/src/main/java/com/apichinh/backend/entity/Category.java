package com.apichinh.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false, length = 120)
   private String title;

   @Column(nullable = true, length = 600)
   private String description;

   @Column(nullable = true, length = 255)
   private String photo;

   @Column(nullable = false)
   private boolean active = true;

   @Column(nullable = false)
   private LocalDateTime createdAt;

   @Column(nullable = false)
   private LocalDateTime updatedAt;

   @JsonIgnore
   @OneToMany(mappedBy = "category")
   private List<Product> products;

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

   public String getTitle() {
      return this.title;
   }

   public String getDescription() {
      return this.description;
   }

   public String getPhoto() {
      return this.photo;
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

   public List<Product> getProducts() {
      return this.products;
   }

   public void setId(final Long id) {
      this.id = id;
   }

   public void setTitle(final String title) {
      this.title = title;
   }

   public void setDescription(final String description) {
      this.description = description;
   }

   public void setPhoto(final String photo) {
      this.photo = photo;
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

   @JsonIgnore
   public void setProducts(final List<Product> products) {
      this.products = products;
   }

   public Category() {
   }

   public Category(final Long id, final String title, final String description, final String photo,
         final List<Product> products) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.photo = photo;
      this.products = products;
   }
}
