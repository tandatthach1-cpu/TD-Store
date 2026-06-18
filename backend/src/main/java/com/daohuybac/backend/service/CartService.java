package com.daohuybac.backend.service;

import com.daohuybac.backend.entity.Cart;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CartService {
   Cart createCart(Cart cart);

   Cart getCartById(Long cartId);

   List<Cart> getCartByUserId(Long userId);

   Page<Cart> getAll(Pageable pageable);

   Cart updateCart(Cart cart);

   void deleteCart(Long cartId);
}
