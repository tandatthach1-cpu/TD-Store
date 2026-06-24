package com.apichinh.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_images")
public class ProductImage {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @ManyToOne
   @JoinColumn(name = "product_id", nullable = false)
   @JsonIgnoreProperties({ "images" })
   private Product product;

   @Column(name = "product_id", insertable = false, updatable = false)
   private Long productId;

   @Column(nullable = false, length = 255)
   private String imageUrl;

   @Column(nullable = false)
   private boolean thumbnail = false;

   @Column(nullable = false)
   private Integer sortOrder = 0;

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

   public String getImageUrl() {
      return imageUrl;
   }

   public void setImageUrl(String imageUrl) {
      this.imageUrl = imageUrl;
   }

   public boolean isThumbnail() {
      return thumbnail;
   }

   public void setThumbnail(boolean thumbnail) {
      this.thumbnail = thumbnail;
   }

   public Integer getSortOrder() {
      return sortOrder;
   }

   public void setSortOrder(Integer sortOrder) {
      this.sortOrder = sortOrder;
   }
}
