package com.apichinh.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;
   @Column(nullable = false)
   private String title;
   @Column(nullable = true)
   private String description;
   @Column(nullable = true)
   private String photo;
   @JsonIgnore
   @OneToMany
   private List<Product> products;

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
