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
@Table(name = "coupons")
public class Coupon {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false, unique = true, length = 60)
   private String code;

   @Column(nullable = false, length = 160)
   private String title;

   @Column(nullable = false)
   private Double discountValue;

   @Column(nullable = false, length = 20)
   private String discountType = "PERCENT";

   @Column(nullable = true)
   private Double minOrderValue;

   @Column(nullable = true)
   private Double maxDiscountValue;

   @Column(nullable = true)
   private Integer quantity;

   @Column(nullable = false)
   private boolean active = true;

   @Column(nullable = true)
   private LocalDateTime startAt;

   @Column(nullable = true)
   private LocalDateTime endAt;

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

   public String getCode() {
      return code;
   }

   public void setCode(String code) {
      this.code = code;
   }

   public String getTitle() {
      return title;
   }

   public void setTitle(String title) {
      this.title = title;
   }

   public Double getDiscountValue() {
      return discountValue;
   }

   public void setDiscountValue(Double discountValue) {
      this.discountValue = discountValue;
   }

   public String getDiscountType() {
      return discountType;
   }

   public void setDiscountType(String discountType) {
      this.discountType = discountType;
   }

   public Double getMinOrderValue() {
      return minOrderValue;
   }

   public void setMinOrderValue(Double minOrderValue) {
      this.minOrderValue = minOrderValue;
   }

   public Double getMaxDiscountValue() {
      return maxDiscountValue;
   }

   public void setMaxDiscountValue(Double maxDiscountValue) {
      this.maxDiscountValue = maxDiscountValue;
   }

   public Integer getQuantity() {
      return quantity;
   }

   public void setQuantity(Integer quantity) {
      this.quantity = quantity;
   }

   public boolean isActive() {
      return active;
   }

   public void setActive(boolean active) {
      this.active = active;
   }

   public LocalDateTime getStartAt() {
      return startAt;
   }

   public void setStartAt(LocalDateTime startAt) {
      this.startAt = startAt;
   }

   public LocalDateTime getEndAt() {
      return endAt;
   }

   public void setEndAt(LocalDateTime endAt) {
      this.endAt = endAt;
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
