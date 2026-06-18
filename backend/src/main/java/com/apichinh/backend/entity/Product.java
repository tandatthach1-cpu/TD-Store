package com.daohuybac.backend.entity;

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

   public Long getCategoryId() {
      return categoryId;
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

   public void setCategoryId(Long categoryId) {
      this.categoryId = categoryId;
   }

   public Category getCategory() {
      return this.category;
   }

   public void setCategory(final Category category) {
      this.category = category;
      if (category != null) {
         this.categoryId = category.getId(); // Cập nhật categoryId khi category thay đổi
      } else {
         this.categoryId = null; // Đặt categoryId thành null nếu category là null
      }
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
      if (category != null) {
         this.categoryId = category.getId(); // Cập nhật categoryId trong constructor
      } else {
         this.categoryId = null; // Đặt categoryId thành null nếu category là null
      }
   }
}
