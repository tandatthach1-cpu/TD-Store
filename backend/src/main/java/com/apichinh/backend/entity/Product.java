package com.apichinh.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false, length = 180)
   private String title;

   @Column(nullable = true, length = 600)
   private String description;

   @Column(nullable = true, columnDefinition = "TEXT")
   private String detailedDescription;

   @Column(nullable = true, length = 255)
   private String photo;

   @Column(nullable = false)
   private double price;

   @Column(nullable = true)
   private Double originalPrice;

   @Column(nullable = false)
   private Integer stockQuantity = 0;

   @Column(nullable = false)
   private boolean visible = true;

   @Column(nullable = false)
   private boolean featured = false;

   @Column(nullable = false)
   private boolean bestSeller = false;

   @Column(nullable = false)
   private LocalDateTime createdAt;

   @Column(nullable = false)
   private LocalDateTime updatedAt;

   @ManyToOne
   @JoinColumn(name = "category_id", nullable = true)
   @JsonIgnoreProperties({ "products" })
   private Category category;

   @Column(name = "category_id", insertable = false, updatable = false)
   private Long categoryId;

   @ManyToOne
   @JoinColumn(name = "brand_id", nullable = true)
   @JsonIgnoreProperties({ "products" })
   private Brand brand;

   @Column(name = "brand_id", insertable = false, updatable = false)
   private Long brandId;

   @OneToMany(mappedBy = "product")
   @OrderBy("sortOrder ASC, id ASC")
   @JsonIgnoreProperties({ "product" })
   private List<ProductImage> images = new ArrayList<>();

   @PrePersist
   public void onCreate() {
      LocalDateTime now = LocalDateTime.now();
      if (this.createdAt == null) {
         this.createdAt = now;
      }
      this.updatedAt = now;
      if (this.originalPrice == null) {
         this.originalPrice = this.price;
      }
      if (this.stockQuantity == null) {
         this.stockQuantity = 0;
      }
   }

   @PreUpdate
   public void onUpdate() {
      this.updatedAt = LocalDateTime.now();
      if (this.originalPrice == null) {
         this.originalPrice = this.price;
      }
      if (this.stockQuantity == null) {
         this.stockQuantity = 0;
      }
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

   public String getDetailedDescription() {
      return detailedDescription;
   }

   public String getPhoto() {
      return this.photo;
   }

   public double getPrice() {
      return this.price;
   }

   public Double getOriginalPrice() {
      return originalPrice;
   }

   public Integer getStockQuantity() {
      return stockQuantity;
   }

   public boolean isVisible() {
      return visible;
   }

   public boolean isFeatured() {
      return this.featured;
   }

   public boolean isBestSeller() {
      return this.bestSeller;
   }

   public LocalDateTime getCreatedAt() {
      return createdAt;
   }

   public LocalDateTime getUpdatedAt() {
      return updatedAt;
   }

   public Category getCategory() {
      return this.category;
   }

   public Long getCategoryId() {
      return this.categoryId;
   }

   public Brand getBrand() {
      return brand;
   }

   public Long getBrandId() {
      return brandId;
   }

   public List<ProductImage> getImages() {
      return images;
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

   public void setDetailedDescription(String detailedDescription) {
      this.detailedDescription = detailedDescription;
   }

   public void setPhoto(final String photo) {
      this.photo = photo;
   }

   public void setPrice(final double price) {
      this.price = price;
   }

   public void setOriginalPrice(Double originalPrice) {
      this.originalPrice = originalPrice;
   }

   public void setStockQuantity(Integer stockQuantity) {
      this.stockQuantity = stockQuantity;
   }

   public void setVisible(boolean visible) {
      this.visible = visible;
   }

   public void setFeatured(final boolean featured) {
      this.featured = featured;
   }

   public void setBestSeller(final boolean bestSeller) {
      this.bestSeller = bestSeller;
   }

   public void setCreatedAt(LocalDateTime createdAt) {
      this.createdAt = createdAt;
   }

   public void setUpdatedAt(LocalDateTime updatedAt) {
      this.updatedAt = updatedAt;
   }

   public void setCategory(final Category category) {
      this.category = category;
      this.categoryId = category != null ? category.getId() : null;
   }

   public void setCategoryId(final Long categoryId) {
      this.categoryId = categoryId;
   }

   public void setBrand(Brand brand) {
      this.brand = brand;
      this.brandId = brand != null ? brand.getId() : null;
   }

   public void setBrandId(Long brandId) {
      this.brandId = brandId;
   }

   public void setImages(List<ProductImage> images) {
      this.images = images;
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
