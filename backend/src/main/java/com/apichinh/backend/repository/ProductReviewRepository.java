package com.apichinh.backend.repository;

import com.apichinh.backend.entity.ProductReview;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
   List<ProductReview> findByProductIdOrderByCreatedAtDesc(Long productId);

   List<ProductReview> findByProductIdAndApprovedTrueOrderByCreatedAtDesc(Long productId);

   Optional<ProductReview> findByProductIdAndUserIdAndOrderId(Long productId, Long userId, Long orderId);

   Optional<ProductReview> findByProductIdAndUserIdOrderByCreatedAtDesc(Long productId, Long userId);
}
