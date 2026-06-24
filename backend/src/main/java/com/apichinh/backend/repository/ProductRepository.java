package com.apichinh.backend.repository;

import com.apichinh.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {
   Page<Product> findAll(Pageable pageable);

   Page<Product> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

   Page<Product> findByCategory_TitleIgnoreCase(String categoryTitle, Pageable pageable);

   Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

   @Query("""
         SELECT p
         FROM Product p
         WHERE (:search IS NULL OR lower(p.title) LIKE lower(concat('%', :search, '%')))
           AND (:categoryId IS NULL OR p.categoryId = :categoryId)
           AND (:brandId IS NULL OR p.brandId = :brandId)
           AND (:visible IS NULL OR p.visible = :visible)
         """)
   Page<Product> search(
         @Param("search") String search,
         @Param("categoryId") Long categoryId,
         @Param("brandId") Long brandId,
         @Param("visible") Boolean visible,
         Pageable pageable);
}
