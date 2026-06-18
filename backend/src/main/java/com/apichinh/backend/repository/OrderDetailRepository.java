package com.daohuybac.backend.repository;



import com.daohuybac.backend.entity.OrderDetail;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
   Page<OrderDetail> findAll(Pageable pageable);

   List<OrderDetail> findByOrderIdAndOrderUserId(Long orderId, Long userId);

   // Lấy chi tiết theo orderId
   List<OrderDetail> findByOrderId(Long orderId);
}

