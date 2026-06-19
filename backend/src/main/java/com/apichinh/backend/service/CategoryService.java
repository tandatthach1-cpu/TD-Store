package com.apichinh.backend.service;

import com.apichinh.backend.entity.Category;
import java.io.IOException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface CategoryService {
   String uploadDir = "image/categories";

   Category createCategory(Category category);

   Category getCategoryById(Long categoryId);

   Page<Category> getAllCategories(Pageable pageable);

   Category updateCategory(Category category);

   void deleteCategory(Long categoryId);

   Category uploadCategory(Category category, MultipartFile file) throws IOException;

   Category updateCategoryWithFile(Long categoryId, Category category, MultipartFile file) throws IOException;
}
