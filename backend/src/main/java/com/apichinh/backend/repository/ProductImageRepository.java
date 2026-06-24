package com.apichinh.backend.repository;

import com.apichinh.backend.entity.ProductImage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
   List<ProductImage> findByProductIdOrderBySortOrderAscIdAsc(Long productId);
}
