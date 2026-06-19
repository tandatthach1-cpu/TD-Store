package com.apichinh.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false, unique = true)
   private String username;


   @Column(nullable = true)
   private String numphone;

   @Column(nullable = true)//, unique = true // unChange
   private String email;

   @Column(nullable = true)
   private String photo;

   @Column(nullable = false)
   private String pass;

  

   // Getters và Setters
   public Long getId() {
      return this.id;
   }

   public String getUsername() {
      return this.username;
   }


   public String getNumphone() {
      return this.numphone;
   }

   public String getEmail() {
      return this.email;
   }

   public String getPhoto() {
      return this.photo;
   }

   public String getPass() {
      return this.pass;
   }



   public void setId(final Long id) {
      this.id = id;
   }

   public void setUsername(final String username) {
      this.username = username;
   }


   public void setNumphone(final String numphone) {
      this.numphone = numphone;
   }

   public void setEmail(final String email) {
      this.email = email;
   }

   public void setPhoto(final String photo) {
      this.photo = photo;
   }

   public void setPass(final String pass) {
      this.pass = pass;
   }


   public User() {
   }

   public User(final Long id, final String username, final String numphone, final String email,
         final String photo, final String pass) {
      this.id = id;
      this.username = username;
      this.numphone = numphone;
      this.email = email;
      this.photo = photo;
      this.pass = pass;
   }
}
