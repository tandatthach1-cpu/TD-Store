package com.daohuybac.backend.repository;

import com.daohuybac.backend.entity.ProductInfo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductInfoRepository extends JpaRepository<ProductInfo, Long> {
    
    Page<ProductInfo> findAll(Pageable pageable);
   
    boolean existsByUserIdAndProductId(Long userId, Long productId);

    List<ProductInfo> findByUserId(Long userId);
    
    List<ProductInfo> findByProductId(Long productId);
}
