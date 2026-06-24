package com.apichinh.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_details")
public class OrderDetail {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   private int quantity;

   private Double unitPrice;

   @ManyToOne
   @JoinColumn(name = "product_id", nullable = false)
   private Product product;

   @ManyToOne
   @JoinColumn(name = "order_id", nullable = false)
   private Order order;

   public Long getId() {
      return this.id;
   }

   public int getQuantity() {
      return this.quantity;
   }

   public Double getUnitPrice() {
      return unitPrice;
   }

   public Product getProduct() {
      return this.product;
   }

   public Order getOrder() {
      return this.order;
   }

   public void setId(final Long id) {
      this.id = id;
   }

   public void setQuantity(final int quantity) {
      this.quantity = quantity;
   }

   public void setUnitPrice(Double unitPrice) {
      this.unitPrice = unitPrice;
   }

   public void setProduct(final Product product) {
      this.product = product;
   }

   public void setOrder(final Order order) {
      this.order = order;
   }

   public OrderDetail() {
   }

   public OrderDetail(final Long id, final int quantity, final Product product, final Order order) {
      this.id = id;
      this.quantity = quantity;
      this.product = product;
      this.order = order;
   }
}
