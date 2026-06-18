package com.daohuybac.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cart")
public class Cart {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;
   @ManyToOne
   @JoinColumn(name = "user_id", nullable = true)
   private User user;
   @JsonIgnore
   @OneToMany(mappedBy = "cart", cascade = { CascadeType.ALL })
   private List<CartDetail> cartDetails = new ArrayList();

   public void removeCartDetail(CartDetail cartDetail) {
      this.cartDetails.remove(cartDetail);
      cartDetail.setCart((Cart) null);
   }

   public Long getId() {
      return this.id;
   }

   public User getUser() {
      return this.user;
   }

   public List<CartDetail> getCartDetails() {
      return this.cartDetails;
   }

   public void setId(final Long id) {
      this.id = id;
   }

   public void setUser(final User user) {
      this.user = user;
   }

   @JsonIgnore
   public void setCartDetails(final List<CartDetail> cartDetails) {
      this.cartDetails = cartDetails;
   }

   public Cart() {
   }

   public Cart(final Long id, final User user, final List<CartDetail> cartDetails) {
      this.id = id;
      this.user = user;
      this.cartDetails = cartDetails;
   }
}
