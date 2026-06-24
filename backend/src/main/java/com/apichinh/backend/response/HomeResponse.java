package com.apichinh.backend.response;

import com.apichinh.backend.dto.NewsDTO;
import com.apichinh.backend.entity.Category;
import com.apichinh.backend.entity.Product;
import com.apichinh.backend.entity.SlideShow;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomeResponse {
   private List<SlideShow> slideShows;
   private List<Category> featuredCategories;
   private List<Product> featuredProducts;
   private List<Product> bestSellerProducts;
   private List<Product> newestProducts;
   private List<NewsDTO> news;
   private HomeStats stats;

   @Data
   @NoArgsConstructor
   @AllArgsConstructor
   public static class HomeStats {
      private long totalProducts;
      private long totalCategories;
      private long featuredProducts;
      private long bestSellerProducts;
   }
}
