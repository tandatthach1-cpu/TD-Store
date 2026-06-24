package com.apichinh.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_reviews")
public class ProductReview {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @ManyToOne
   @JoinColumn(name = "product_id", nullable = false)
   @JsonIgnoreProperties({ "images" })
   private Product product;

   @Column(name = "product_id", insertable = false, updatable = false)
   private Long productId;

   @ManyToOne
   @JoinColumn(name = "user_id", nullable = true)
   @JsonIgnoreProperties({ "pass" })
   private User user;

   @Column(name = "user_id", insertable = false, updatable = false)
   private Long userId;

   @ManyToOne
   @JoinColumn(name = "order_id", nullable = true)
   @JsonIgnoreProperties({ "user" })
   private Order order;

   @Column(name = "order_id", insertable = false, updatable = false)
   private Long orderId;

   @Column(nullable = false)
   private Integer rating = 5;

   @Column(nullable = true, length = 2000)
   private String comment;

   @Column(nullable = false)
   private boolean approved = true;

   @Column(nullable = false)
   private LocalDateTime createdAt;

   @PrePersist
   public void onCreate() {
      if (this.createdAt == null) {
         this.createdAt = LocalDateTime.now();
      }
   }

   public Long getId() {
      return id;
   }

   public void setId(Long id) {
      this.id = id;
   }

   public Product getProduct() {
      return product;
   }

   public void setProduct(Product product) {
      this.product = product;
      this.productId = product != null ? product.getId() : null;
   }

   public Long getProductId() {
      return productId;
   }

   public void setProductId(Long productId) {
      this.productId = productId;
   }

   public User getUser() {
      return user;
   }

   public void setUser(User user) {
      this.user = user;
      this.userId = user != null ? user.getId() : null;
   }

   public Long getUserId() {
      return userId;
   }

   public void setUserId(Long userId) {
      this.userId = userId;
   }

   public Order getOrder() {
      return order;
   }

   public void setOrder(Order order) {
      this.order = order;
      this.orderId = order != null ? order.getId() : null;
   }

   public Long getOrderId() {
      return orderId;
   }

   public void setOrderId(Long orderId) {
      this.orderId = orderId;
   }

   public Integer getRating() {
      return rating;
   }

   public void setRating(Integer rating) {
      this.rating = rating;
   }

   public String getComment() {
      return comment;
   }

   public void setComment(String comment) {
      this.comment = comment;
   }

   public boolean isApproved() {
      return approved;
   }

   public void setApproved(boolean approved) {
      this.approved = approved;
   }

   public LocalDateTime getCreatedAt() {
      return createdAt;
   }

   public void setCreatedAt(LocalDateTime createdAt) {
      this.createdAt = createdAt;
   }
}
