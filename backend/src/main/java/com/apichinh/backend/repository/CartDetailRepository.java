package com.daohuybac.backend.repository;

import com.daohuybac.backend.entity.CartDetail;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartDetailRepository extends JpaRepository<CartDetail, Long> {
   Page<CartDetail> findAll(Pageable pageable);

   List<CartDetail> findByCartId(Long cartId);

   CartDetail findFirstByProduct_IdAndCart_Id(Long productId, Long cartId);
}
