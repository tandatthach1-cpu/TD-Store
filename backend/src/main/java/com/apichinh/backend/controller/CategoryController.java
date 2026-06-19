package com.apichinh.backend.controller;

import com.apichinh.backend.entity.Category;
import com.apichinh.backend.service.CategoryService;
import java.io.IOException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping({ "api/categories" })
@CrossOrigin(origins = { "*" }, exposedHeaders = { "Content-Range" })
public class CategoryController {
   private CategoryService categoryService;

   @PostMapping
   public ResponseEntity<?> addCategory(@ModelAttribute Category category,
         @RequestParam(value = "file", required = false) MultipartFile file) {
      Category savedCategory;
      if (file != null) {
         try {
            savedCategory = this.categoryService.uploadCategory(category, file);
            return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
         } catch (IOException var4) {
            return new ResponseEntity<>("Error uploading image.", HttpStatus.INTERNAL_SERVER_ERROR);
         }
      } else {
         savedCategory = this.categoryService.createCategory(category);
         return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
      }
   }

   @GetMapping({ "{id}" })
   public ResponseEntity<Category> getCategoryById(@PathVariable("id") Long categoryId) {
      Category category = this.categoryService.getCategoryById(categoryId);
      return category != null ? new ResponseEntity<>(category, HttpStatus.OK)
            : new ResponseEntity<>(HttpStatus.NOT_FOUND);
   }

   @GetMapping
   public ResponseEntity<Page<Category>> getAllCategorys(@RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "10") int size) {
      Pageable pageable = PageRequest.of(page, size);
      Page<Category> Categories = this.categoryService.getAllCategories(pageable);
      return new ResponseEntity<>(Categories, HttpStatus.OK);
   }

   @PutMapping({ "{id}" })
   public ResponseEntity<?> updateCategory(@PathVariable("id") Long categoryId, @ModelAttribute Category category,
         @RequestParam(value = "file", required = false) MultipartFile file) {
      Category updatedCategory;
      if (file != null) {
         try {
            updatedCategory = this.categoryService.updateCategoryWithFile(categoryId, category, file);
            return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
         } catch (IOException var5) {
            return new ResponseEntity<>("Error uploading image.", HttpStatus.INTERNAL_SERVER_ERROR);
         }
      } else {
         category.setId(categoryId);
         updatedCategory = this.categoryService.updateCategory(category);
         return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
      }
   }

   @DeleteMapping({ "{id}" })
   public ResponseEntity<String> deleteCategory(@PathVariable("id") Long categoryId) {
      this.categoryService.deleteCategory(categoryId);
      return new ResponseEntity<>("Category successfully deleted!", HttpStatus.OK);
   }

   public CategoryController(final CategoryService categoryService) {
      this.categoryService = categoryService;
   }
}
