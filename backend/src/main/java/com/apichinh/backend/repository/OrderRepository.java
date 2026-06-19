package com.apichinh.backend.repository;



import com.apichinh.backend.entity.Order;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
   Page<Order> findAll(Pageable pageable);

   // Lọc theo user đang đăng nhập (Order có field userId)
   List<Order> findByUserId(Long userId);
}

