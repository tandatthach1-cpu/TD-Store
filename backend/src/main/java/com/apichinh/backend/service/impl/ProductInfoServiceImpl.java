package com.apichinh.backend.service.impl;

import com.apichinh.backend.dto.ProductInfoDTO;
import com.apichinh.backend.entity.ProductInfo;
import com.apichinh.backend.entity.User;
import com.apichinh.backend.entity.Product; 
import com.apichinh.backend.repository.ProductInfoRepository;
import com.apichinh.backend.repository.ProductRepository;
import com.apichinh.backend.repository.UserRepository;
import com.apichinh.backend.response.ProductInfoResponse;
import com.apichinh.backend.service.ProductInfoService;



import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductInfoServiceImpl implements ProductInfoService {

    private final ProductInfoRepository productInfoRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductInfoServiceImpl(ProductInfoRepository productInfoRepository, 
                                   ProductRepository productRepository, 
                                   UserRepository userRepository) {
        this.productInfoRepository = productInfoRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ProductInfoResponse addFavorite(ProductInfoDTO productInfoDTO) {
        // Lấy sản phẩm và người dùng từ repository
        Product product = productRepository.findById(productInfoDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        User user = userRepository.findById(productInfoDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tạo mới một ProductInfo và đánh dấu là yêu thích
        ProductInfo productInfo = new ProductInfo();
        productInfo.setProduct(product);
        productInfo.setUser(user);
        productInfo.setFavorite(true);  // Đánh dấu là yêu thích

        productInfoRepository.save(productInfo);

        return convertToResponse(productInfo);
    }
    @Override
    public void deleteFavorite(Long id) {
        // Kiểm tra xem sản phẩm yêu thích có tồn tại hay không
        if (!productInfoRepository.existsById(id)) {
            throw new RuntimeException("Favorite not found");
        }
        productInfoRepository.deleteById(id); // Xóa sản phẩm yêu thích
    }

    @Override
    public List<ProductInfoResponse> getFavoritesByUserId(Long userId) {
        
        List<ProductInfo> productInfos = productInfoRepository.findByUserId(userId);
        return productInfos.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    @Override
    public boolean isFavorite(Long userId, Long productId) {
        // Kiểm tra xem có sản phẩm yêu thích nào tồn tại với userId và productId không
        return productInfoRepository.existsByUserIdAndProductId(userId, productId);
    }
    @Override
    public ProductInfoResponse addComment(ProductInfoDTO productInfoDTO) {
        Product product = productRepository.findById(productInfoDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        User user = userRepository.findById(productInfoDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProductInfo productInfo = new ProductInfo();
        productInfo.setProduct(product);
        productInfo.setUser(user);
        productInfo.setComment(productInfoDTO.getComment());

        productInfoRepository.save(productInfo);

        return convertToResponse(productInfo);
    }
    @Override
    public List<ProductInfoResponse> getCommentsByProductId(Long productId) {
        List<ProductInfo> productInfos = productInfoRepository.findByProductId(productId);
        // Sắp xếp theo ID giảm dần (bình luận mới nhất lên đầu)
        return productInfos.stream()
                .filter(productInfo -> productInfo.getComment() != null)
                .sorted((a, b) -> Long.compare(b.getId(), a.getId())) // ID mới hơn lên đầu
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    

    private ProductInfoResponse convertToResponse(ProductInfo productInfo) {
        return new ProductInfoResponse(
                productInfo.getId(),
                productInfo.getProduct().getId(),
                productInfo.getUser().getId(),
                productInfo.getUser().getUsername(),
                productInfo.getComment(),
                productInfo.isFavorite()
        );
    }


}
