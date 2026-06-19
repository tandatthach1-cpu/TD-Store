package com.apichinh.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "slideshows")
public class SlideShow {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;
   @Column(nullable = true)
   private String title;
   @Column(name = "photo", nullable = false)
   private String photo;

   public Long getId() {
      return this.id;
   }

   public String getTitle() {
      return this.title;
   }

   public String getPhoto() {
      return this.photo;
   }

   public void setId(final Long id) {
      this.id = id;
   }

   public void setTitle(final String title) {
      this.title = title;
   }

   public void setPhoto(final String photo) {
      this.photo = photo;
   }

   public SlideShow() {
   }

   public SlideShow(final Long id, final String title, final String photo) {
      this.id = id;
      this.title = title;
      this.photo = photo;
   }
}
