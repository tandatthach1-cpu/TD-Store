package com.daohuybac.backend.service.impl;

import com.daohuybac.backend.entity.Category;
import com.daohuybac.backend.repository.CategoryRepository;
import com.daohuybac.backend.service.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId));
    }

    @Override
    public Page<Category> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    @Override
    public Category updateCategory(Category category) {
        Category existingCategory = categoryRepository.findById(category.getId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + category.getId()));

        existingCategory.setTitle(category.getTitle());
        existingCategory.setDescription(category.getDescription());
        return categoryRepository.save(existingCategory);
    }

    @Override
    public Category updateCategoryWithFile(Long categoryId, Category category, MultipartFile file) throws IOException {
        Category existingCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId));

        if (file != null && !file.isEmpty()) {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = fileName.substring(fileName.lastIndexOf("."));
            String storedFileName = UUID.randomUUID().toString() + fileExtension;
            Path uploadPath = Paths.get("image/categories");
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(storedFileName);
            file.transferTo(filePath);
            existingCategory.setPhoto(storedFileName);
        }

        existingCategory.setTitle(category.getTitle());
        existingCategory.setDescription(category.getDescription());
        return categoryRepository.save(existingCategory);
    }

    @Override
    public void deleteCategory(Long categoryId) {
        categoryRepository.deleteById(categoryId);
    }

    @Override
    public Category uploadCategory(Category category, MultipartFile file) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = fileName.substring(fileName.lastIndexOf("."));
        String storedFileName = UUID.randomUUID().toString() + fileExtension;
        Path uploadPath = Paths.get("image/categories");
        Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(storedFileName);
        file.transferTo(filePath);
        category.setPhoto(storedFileName);
        return categoryRepository.save(category);
    }

}
