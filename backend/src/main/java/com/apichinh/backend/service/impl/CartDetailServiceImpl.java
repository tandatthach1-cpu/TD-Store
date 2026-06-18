package com.daohuybac.backend.service.impl;

import com.daohuybac.backend.entity.CartDetail;
import com.daohuybac.backend.repository.CartDetailRepository;
import com.daohuybac.backend.service.CartDetailService;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CartDetailServiceImpl implements CartDetailService {
   private CartDetailRepository cartDetailRepository;

   public CartDetail createCartDetail(CartDetail cartDetail) {
      return (CartDetail) this.cartDetailRepository.save(cartDetail);
   }

   public CartDetail createOrUpdateCartDetail(CartDetail cartDetail) {
      CartDetail existingCartDetail = this.cartDetailRepository
            .findFirstByProduct_IdAndCart_Id(cartDetail.getProduct().getId(), cartDetail.getCart().getId());
      if (existingCartDetail != null) {
         existingCartDetail.setQuantity(existingCartDetail.getQuantity() + cartDetail.getQuantity());
         return (CartDetail) this.cartDetailRepository.save(existingCartDetail);
      } else {
         return (CartDetail) this.cartDetailRepository.save(cartDetail);
      }
   }

   public CartDetail getCartDetailById(Long cartDetailId) {
      Optional<CartDetail> optionalCartDetail = this.cartDetailRepository.findById(cartDetailId);
      return (CartDetail) optionalCartDetail.get();
   }

   public Page<CartDetail> getAll(Pageable pageable) {
      return this.cartDetailRepository.findAll(pageable);
   }

   public List<CartDetail> getCartDetailByCartId(Long cartId) {
      return this.cartDetailRepository.findByCartId(cartId);
   }

   public CartDetail updateCartDetail(CartDetail cartDetail) {
      CartDetail existingCartDetail = (CartDetail) this.cartDetailRepository.findById(cartDetail.getId()).get();
      existingCartDetail.setProduct(cartDetail.getProduct());
      existingCartDetail.setQuantity(cartDetail.getQuantity());
      existingCartDetail.setProduct(cartDetail.getProduct());
      CartDetail updatedCartDetail = (CartDetail) this.cartDetailRepository.save(existingCartDetail);
      return updatedCartDetail;
   }

   public void deleteCartDetail(Long cartDetailId) {
      this.cartDetailRepository.deleteById(cartDetailId);
   }

   public CartDetailServiceImpl(final CartDetailRepository cartDetailRepository) {
      this.cartDetailRepository = cartDetailRepository;
   }
}
