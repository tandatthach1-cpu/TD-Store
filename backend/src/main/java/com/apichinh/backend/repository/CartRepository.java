package com.apichinh.backend.repository;



import com.apichinh.backend.entity.Cart;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
   Page<Cart> findAll(Pageable pageable);

   List<Cart> findByUserId(Long userId);
}
