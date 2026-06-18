package com.daohuybac.backend.controller;

import com.daohuybac.backend.entity.CartDetail;
import com.daohuybac.backend.service.CartDetailService;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({ "api/cartDetails" })
@CrossOrigin(origins = { "*" }, exposedHeaders = { "Content-Range" })
public class CartDetailController {
   private CartDetailService cartDetailService;

   @PostMapping
   public ResponseEntity<CartDetail> createCartDetail(@RequestBody CartDetail cartDetail) {
      CartDetail savedCartDetail = this.cartDetailService.createOrUpdateCartDetail(cartDetail);
      return new ResponseEntity<>(savedCartDetail, HttpStatus.CREATED);
   }

   @GetMapping({ "{id}" })
   public ResponseEntity<CartDetail> getCartDetailById(@PathVariable("id") Long cartDetailId) {
      CartDetail cartDetail = this.cartDetailService.getCartDetailById(cartDetailId);
      return cartDetail != null ? new ResponseEntity<>(cartDetail, HttpStatus.OK)
            : new ResponseEntity<>(HttpStatus.NOT_FOUND);
   }

   @GetMapping
   public ResponseEntity<Page<CartDetail>> getAllCartDetails(@RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "10") int size) {
      Pageable pageable = PageRequest.of(page, size);
      Page<CartDetail> Categories = this.cartDetailService.getAll(pageable);
      return new ResponseEntity<>(Categories, HttpStatus.OK);
   }

   @GetMapping({ "/cart/{cartId}" })
   public ResponseEntity<List<CartDetail>> getCartByUserId(@PathVariable("cartId") Long cartId) {
      List<CartDetail> cartDetail = this.cartDetailService.getCartDetailByCartId(cartId);
      return !cartDetail.isEmpty() ? new ResponseEntity<>(cartDetail, HttpStatus.OK)
            : new ResponseEntity<>(HttpStatus.NOT_FOUND);
   }

   @PutMapping({ "{id}" })
   public ResponseEntity<?> updateCartDetail(@PathVariable("id") Long cartDetailId,
         @RequestBody CartDetail cartDetail) {
      cartDetail.setId(cartDetailId);
      CartDetail updatedCartDetail = this.cartDetailService.updateCartDetail(cartDetail);
      return new ResponseEntity<>(updatedCartDetail, HttpStatus.OK);
   }

   @DeleteMapping({ "{id}" })
   public ResponseEntity<String> deleteCartDetail(@PathVariable("id") Long cartDetailId) {
      this.cartDetailService.deleteCartDetail(cartDetailId);
      return new ResponseEntity<>("CartDetail successfully deleted!", HttpStatus.OK);
   }

   public CartDetailController(final CartDetailService cartDetailService) {
      this.cartDetailService = cartDetailService;
   }
}
