package com.daohuybac.backend.entity;

import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name = "productinfo")
public class ProductInfo {
    @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;
   @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

   
   @Column(nullable = true)
   private String comment;
   @Column(nullable = true)
   private boolean favorite;
   
   
   

   public Long getId() {
    return this.id;
 }

 public String getComment() {
    return this.comment;
 }

 public boolean isFavorite() { 
   return favorite;
}
 public Product getProduct() {
    return this.product;
}
public User getUser() {
    return this.user;
}


 public void setId(final Long id) {
    this.id = id;
 }

 public void setComment(final String comment) {
    this.comment = comment;
 }

 public void setFavorite(boolean favorite) { 
   this.favorite = favorite;
}
 public void setProduct(final Product product) {
    this.product = product;
}
public void setUser(final User user) {
    this.user = user;
}
}
