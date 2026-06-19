package com.apichinh.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;

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
   private User user;
   @Column(name = "user_id", insertable = false, updatable = false)
   private Long userId;

   @Column(nullable = true)
   private String address;

   @Column(nullable = true)
   private String status;

   public Long getId() {
      return this.id;
   }

   public Date getDate() {
      return this.date;
   }

   public String getAddress() {
      return this.address;
   }

   public void setAddress(String address) {
      this.address = address;
   }

   public String getStatus() {
      return this.status;
   }

   public void setStatus(String status) {
      this.status = status;
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
