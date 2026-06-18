package com.daohuybac.backend.repository;


import com.daohuybac.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
   Page<Product> findAll(Pageable pageable);
   
   Page<Product> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

   Page<Product> findByCategory_TitleIgnoreCase(String categoryTitle, Pageable pageable);
   
   Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

   
}
