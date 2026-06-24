package com.apichinh.backend.controller;

import com.apichinh.backend.dto.NewsDTO;
import com.apichinh.backend.entity.Category;
import com.apichinh.backend.entity.Content;
import com.apichinh.backend.entity.Product;
import com.apichinh.backend.entity.SlideShow;
import com.apichinh.backend.response.HomeResponse;
import com.apichinh.backend.service.CategoryService;
import com.apichinh.backend.service.ContentService;
import com.apichinh.backend.service.ProductService;
import com.apichinh.backend.service.SlideShowService;
import java.util.Comparator;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = "*")
public class HomeController {
   private final ProductService productService;
   private final CategoryService categoryService;
   private final SlideShowService slideShowService;
   private final ContentService contentService;

   public HomeController(
         final ProductService productService,
         final CategoryService categoryService,
         final SlideShowService slideShowService,
         final ContentService contentService) {
      this.productService = productService;
      this.categoryService = categoryService;
      this.slideShowService = slideShowService;
      this.contentService = contentService;
   }

   @GetMapping
   public ResponseEntity<HomeResponse> getHomeData() {
      Pageable productPageable = PageRequest.of(0, 100);
      Pageable categoryPageable = PageRequest.of(0, 8);
      Pageable slidePageable = PageRequest.of(0, 5);

      Page<Product> productPage = productService.getAllProducts(productPageable);
      Page<Category> categoryPage = categoryService.getAllCategories(categoryPageable);
      Page<SlideShow> slidePage = slideShowService.getAllCategories(slidePageable);

      List<Product> allProducts = productPage.getContent();

      List<Product> featuredProducts = allProducts.stream()
            .filter(Product::isFeatured)
            .limit(8)
            .toList();
      if (featuredProducts.isEmpty()) {
         featuredProducts = allProducts.stream().limit(8).toList();
      }

      List<Product> bestSellerProducts = allProducts.stream()
            .filter(Product::isBestSeller)
            .limit(8)
            .toList();
      if (bestSellerProducts.isEmpty()) {
         bestSellerProducts = allProducts.stream()
               .skip(Math.min(4, allProducts.size()))
               .limit(8)
               .toList();
      }

      List<Product> newestProducts = allProducts.stream()
            .sorted(Comparator.comparing(Product::getId, Comparator.nullsLast(Long::compareTo)).reversed())
            .limit(8)
            .toList();

      List<NewsDTO> news = contentService.getPublishedContentsByType("NEWS", 4).stream()
            .map(this::toNewsDto)
            .toList();

      HomeResponse response = new HomeResponse(
            slidePage.getContent(),
            categoryPage.getContent(),
            featuredProducts,
            bestSellerProducts,
            newestProducts,
            news,
            new HomeResponse.HomeStats(
                  productPage.getTotalElements(),
                  categoryPage.getTotalElements(),
                  allProducts.stream().filter(Product::isFeatured).count(),
                  allProducts.stream().filter(Product::isBestSeller).count()));

      return ResponseEntity.ok(response);
   }

   private NewsDTO toNewsDto(Content content) {
      return new NewsDTO(
            content.getId(),
            content.getTitle(),
            content.getSummary() != null && !content.getSummary().isBlank() ? content.getSummary() : content.getBody(),
            resolveContentImageUrl(content.getImageUrl()),
            "Cập nhật từ quản trị",
            content.isFeatured() ? "Nổi bật" : "Tin tức");
   }
   private String resolveContentImageUrl(String imageName) {
      if (!StringUtils.hasText(imageName)) {
         return null;
      }
      if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
         return imageName;
      }
      return ServletUriComponentsBuilder.fromCurrentContextPath()
            .path("/api/contents/images/")
            .path(imageName)
            .toUriString();
   }
}
