package com.daohuybac.backend.service;

import com.daohuybac.backend.entity.CartDetail;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CartDetailService {
   CartDetail createCartDetail(CartDetail orderDetail);

   CartDetail getCartDetailById(Long orderDetailId);

   Page<CartDetail> getAll(Pageable pageable);

   List<CartDetail> getCartDetailByCartId(Long orderId);

   CartDetail createOrUpdateCartDetail(CartDetail cartDetail);

   CartDetail updateCartDetail(CartDetail orderDetail);

   void deleteCartDetail(Long orderDetailId);
}
