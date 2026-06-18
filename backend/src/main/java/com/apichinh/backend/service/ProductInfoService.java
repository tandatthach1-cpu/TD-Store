package com.daohuybac.backend.service;



import com.daohuybac.backend.dto.ProductInfoDTO;

import com.daohuybac.backend.response.ProductInfoResponse;
import java.util.List;

public interface ProductInfoService {
    
    ProductInfoResponse addFavorite(ProductInfoDTO productInfoDTO);



    void deleteFavorite(Long id);



    List<ProductInfoResponse> getFavoritesByUserId(Long userId);



    boolean isFavorite(Long userId, Long productId);



    ProductInfoResponse addComment(ProductInfoDTO productInfoDTO);



    List<ProductInfoResponse> getCommentsByProductId(Long productId);
   

}
