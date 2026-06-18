package com.daohuybac.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    private String street;

    private String ward;

    private String district;

    private String city;

    private String country;

    private Double latitude;

    private Double longitude;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    public Long getId() {
        return this.id;
    }

    public String getStreet() {
        return this.street;
    }

    public String getWard() {
        return this.ward;
    }

    public String getDistrict() {
        return this.district;
    }

    public String getCity() {
        return this.city;
    }

    public String getCountry() {
        return this.country;
    }

    public Double getLatitude() {
        return this.latitude;
    }

    public Double getLongitude() {
        return this.longitude;
    }

 

    public User getUser() {
        return this.user;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public void setStreet(final String street) {
        this.street = street;
    }

    public void setWard(final String ward) {
        this.ward = ward;
    }

    public void setDistrict(final String district) {
        this.district = district;
    }

    public void setCity(final String city) {
        this.city = city;
    }

    public void setCountry(final String country) {
        this.country = country;
    }

    public void setLatitude(final Double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(final Double longitude) {
        this.longitude = longitude;
    }

    public void setUser(final User user) {
        this.user = user;
    }


    public Address() {
    }

    public Address(Long id, String street, String ward, String district, String city, String country, Double latitude, Double longitude, User user) {
        this.id = id;
        this.street = street;
        this.ward = ward;
        this.district = district;
        this.city = city;
        this.country = country;
        this.latitude = latitude;
        this.longitude = longitude;
        this.user = user;
    }
}
