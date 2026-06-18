package com.daohuybac.backend.service.impl;

import com.daohuybac.backend.entity.Cart;
import com.daohuybac.backend.repository.CartRepository;
import com.daohuybac.backend.service.CartService;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl implements CartService {
   private CartRepository cartRepository;

   public Cart createCart(Cart cart) {
      return (Cart) this.cartRepository.save(cart);
   }

   public Cart getCartById(Long cartId) {
      Optional<Cart> optionalCart = this.cartRepository.findById(cartId);
      return (Cart) optionalCart.get();
   }

   public Page<Cart> getAll(Pageable pageable) {
      return this.cartRepository.findAll(pageable);
   }

   public Cart updateCart(Cart cart) {
      Cart existingCart = (Cart) this.cartRepository.findById(cart.getId()).get();
      existingCart.setUser(cart.getUser());
      Cart updatedCart = (Cart) this.cartRepository.save(existingCart);
      return updatedCart;
   }

   public void deleteCart(Long cartId) {
      this.cartRepository.deleteById(cartId);
   }

   public List<Cart> getCartByUserId(Long userId) {
      return this.cartRepository.findByUserId(userId);
   }

   public CartServiceImpl(final CartRepository cartRepository) {
      this.cartRepository = cartRepository;
   }
}
