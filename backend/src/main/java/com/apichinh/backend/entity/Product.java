package com.apichinh.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false)
   private String title;

   @Column(nullable = true)
   private String description;

   @Column(nullable = true)
   private String photo;

   @Column(nullable = false)
   private double price;

   @Column(nullable = false)
   private boolean featured = false;

   @Column(nullable = false)
   private boolean bestSeller = false;

   @ManyToOne
   @JoinColumn(name = "category_id", nullable = true)
   private Category category;

   @Column(name = "category_id", insertable = false, updatable = false)
   private Long categoryId;

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

   public double getPrice() {
      return this.price;
   }

   public boolean isFeatured() {
      return this.featured;
   }

   public boolean isBestSeller() {
      return this.bestSeller;
   }

   public Category getCategory() {
      return this.category;
   }

   public Long getCategoryId() {
      return this.categoryId;
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

   public void setPrice(final double price) {
      this.price = price;
   }

   public void setFeatured(final boolean featured) {
      this.featured = featured;
   }

   public void setBestSeller(final boolean bestSeller) {
      this.bestSeller = bestSeller;
   }

   public void setCategory(final Category category) {
      this.category = category;
      this.categoryId = category != null ? category.getId() : null;
   }

   public void setCategoryId(final Long categoryId) {
      this.categoryId = categoryId;
   }

   public Product() {
   }

   public Product(final Long id, final String title, final String description, final String photo, final double price,
         final Category category) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.photo = photo;
      this.price = price;
      this.category = category;
      this.categoryId = category != null ? category.getId() : null;
   }
}
