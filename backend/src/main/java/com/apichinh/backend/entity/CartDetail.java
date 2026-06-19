package com.apichinh.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "cart_detail")
public class CartDetail {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;
   private int quantity;
   @ManyToOne
   @JoinColumn(name = "product_id", nullable = false)
   private Product product;
   @ManyToOne
   @JoinColumn(name = "cart_id", nullable = false)
   private Cart cart;

   public Long getId() {
      return this.id;
   }

   public int getQuantity() {
      return this.quantity;
   }

   public Product getProduct() {
      return this.product;
   }

   public Cart getCart() {
      return this.cart;
   }

   public void setId(final Long id) {
      this.id = id;
   }

   public void setQuantity(final int quantity) {
      this.quantity = quantity;
   }

   public void setProduct(final Product product) {
      this.product = product;
   }

   public void setCart(final Cart cart) {
      this.cart = cart;
   }

   public CartDetail() {
   }

   public CartDetail(final Long id, final int quantity, final Product product, final Cart cart) {
      this.id = id;
      this.quantity = quantity;
      this.product = product;
      this.cart = cart;
   }
}
