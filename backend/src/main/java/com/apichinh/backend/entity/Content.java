package com.apichinh.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PostLoad;
import jakarta.persistence.Table;

@Entity
@Table(name = "contents")
public class Content {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false, length = 180)
   private String title;

   @Column(nullable = true, length = 400)
   private String summary;

   @Column(nullable = true, columnDefinition = "TEXT")
   private String body;

   @Column(nullable = true, length = 600)
   private String imageUrl;

   @Column(nullable = false, length = 40)
   private String contentType = "NEWS";

   @Column(nullable = false, length = 40)
   private String status = "PUBLISHED";

   @Column(nullable = false)
   private boolean featured = false;

   @Column(nullable = false)
   private Integer displayOrder = 0;

   public Long getId() {
      return id;
   }

   public void setId(Long id) {
      this.id = id;
   }

   public String getTitle() {
      return title;
   }

   public void setTitle(String title) {
      this.title = title;
   }

   public String getSummary() {
      return summary;
   }

   public void setSummary(String summary) {
      this.summary = summary;
   }

   public String getBody() {
      return body;
   }

   public void setBody(String body) {
      this.body = body;
   }

   public String getImageUrl() {
      return imageUrl;
   }

   public void setImageUrl(String imageUrl) {
      this.imageUrl = normalizeImageUrl(imageUrl);
   }

   public String getContentType() {
      return contentType;
   }

   public void setContentType(String contentType) {
      this.contentType = contentType;
   }

   public String getStatus() {
      return status;
   }

   public void setStatus(String status) {
      this.status = status;
   }

   public boolean isFeatured() {
      return featured;
   }

   public void setFeatured(boolean featured) {
      this.featured = featured;
   }

   public Integer getDisplayOrder() {
      return displayOrder;
   }

   public void setDisplayOrder(Integer displayOrder) {
      this.displayOrder = displayOrder;
   }

   @PostLoad
   private void normalizeLoadedImageUrl() {
      this.imageUrl = normalizeImageUrl(this.imageUrl);
   }

   private String normalizeImageUrl(String imageUrl) {
      if (imageUrl == null || imageUrl.isBlank()) {
         return imageUrl;
      }

      for (String part : imageUrl.split(",")) {
         String normalizedPart = part.trim();
         if (!normalizedPart.isEmpty()) {
            return normalizedPart;
         }
      }

      return imageUrl.trim();
   }
}
