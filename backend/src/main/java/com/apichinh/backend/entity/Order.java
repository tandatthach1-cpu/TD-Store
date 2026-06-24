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
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Temporal(TemporalType.TIMESTAMP)
   private Date date;

   @ManyToOne
   @JoinColumn(name = "user_id", nullable = false)
   @JsonIgnoreProperties({ "pass" })
   private User user;

   @Column(name = "user_id", insertable = false, updatable = false)
   private Long userId;

   @Column(nullable = false, unique = true, length = 40)
   private String orderCode;

   @Column(nullable = true)
   private String address;

   @Column(nullable = true)
   private String status;

   @Column(nullable = true)
   private String paymentStatus;

   @Column(nullable = false)
   private boolean stockDeducted = false;

   @Column(nullable = true)
   private Double totalAmount = 0d;

   @Column(nullable = true)
   private Double originalAmount = 0d;

   @Column(nullable = true)
   private Double discountAmount = 0d;

   @Column(nullable = true, length = 60)
   private String couponCode;

   @Column(nullable = true, length = 160)
   private String couponTitle;

   @Column(nullable = true)
   private String customerName;

   @Column(nullable = true)
   private String customerPhone;

   @Column(nullable = true, length = 1000)
   private String note;

   @Temporal(TemporalType.TIMESTAMP)
   @Column(nullable = false)
   private Date updatedAt;

   @PrePersist
   public void onCreate() {
      Date now = new Date();
      if (this.date == null) {
         this.date = now;
      }
      if (this.orderCode == null || this.orderCode.isBlank()) {
         this.orderCode = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
      }
      this.updatedAt = now;
      if (this.totalAmount == null) {
         this.totalAmount = 0d;
      }
      if (this.originalAmount == null) {
         this.originalAmount = this.totalAmount;
      }
      if (this.discountAmount == null) {
         this.discountAmount = 0d;
      }
   }

   @PreUpdate
   public void onUpdate() {
      this.updatedAt = new Date();
      if (this.totalAmount == null) {
         this.totalAmount = 0d;
      }
   }

   public Long getId() {
      return this.id;
   }

   public Date getDate() {
      return this.date;
   }

   public String getOrderCode() {
      return orderCode;
   }

   public String getAddress() {
      return this.address;
   }

   public String getStatus() {
      return this.status;
   }

   public String getPaymentStatus() {
      return paymentStatus;
   }

   public boolean isStockDeducted() {
      return stockDeducted;
   }

   public Double getTotalAmount() {
      return totalAmount;
   }

   public Double getOriginalAmount() {
      return originalAmount;
   }

   public Double getDiscountAmount() {
      return discountAmount;
   }

   public String getCouponCode() {
      return couponCode;
   }

   public String getCouponTitle() {
      return couponTitle;
   }

   public String getCustomerName() {
      return customerName;
   }

   public String getCustomerPhone() {
      return customerPhone;
   }

   public String getNote() {
      return note;
   }

   public Date getUpdatedAt() {
      return updatedAt;
   }

   public Long getUserId() {
      return this.userId;
   }

   public User getUser() {
      return this.user;
   }

   public void setId(final Long id) {
      this.id = id;
   }

   public void setDate(final Date date) {
      this.date = date;
   }

   public void setOrderCode(String orderCode) {
      this.orderCode = orderCode;
   }

   public void setAddress(String address) {
      this.address = address;
   }

   public void setStatus(String status) {
      this.status = status;
   }

   public void setPaymentStatus(String paymentStatus) {
      this.paymentStatus = paymentStatus;
   }

   public void setStockDeducted(boolean stockDeducted) {
      this.stockDeducted = stockDeducted;
   }

   public void setTotalAmount(Double totalAmount) {
      this.totalAmount = totalAmount;
   }

   public void setOriginalAmount(Double originalAmount) {
      this.originalAmount = originalAmount;
   }

   public void setDiscountAmount(Double discountAmount) {
      this.discountAmount = discountAmount;
   }

   public void setCouponCode(String couponCode) {
      this.couponCode = couponCode;
   }

   public void setCouponTitle(String couponTitle) {
      this.couponTitle = couponTitle;
   }

   public void setCustomerName(String customerName) {
      this.customerName = customerName;
   }

   public void setCustomerPhone(String customerPhone) {
      this.customerPhone = customerPhone;
   }

   public void setNote(String note) {
      this.note = note;
   }

   public void setUpdatedAt(Date updatedAt) {
      this.updatedAt = updatedAt;
   }

   public void setUser(final User user) {
      this.user = user;
   }

   public Order() {
   }

   public Order(final Long id, final Date date, final User user) {
      this.id = id;
      this.date = date;
      this.user = user;
   }
}
