package com.apichinh.backend.controller;

import com.apichinh.backend.dto.NewsDTO;
import com.apichinh.backend.entity.Content;
import com.apichinh.backend.service.ContentService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")
public class NewsController {
   private final ContentService contentService;

   public NewsController(ContentService contentService) {
      this.contentService = contentService;
   }

   @GetMapping
   public ResponseEntity<List<NewsDTO>> getNews(
         @RequestParam(name = "type", defaultValue = "NEWS") String contentType,
         @RequestParam(name = "limit", defaultValue = "20") int limit) {
      List<NewsDTO> news = contentService.getPublishedContentsByType(contentType, limit).stream()
            .map(this::toNewsDto)
            .toList();
      return ResponseEntity.ok(news);
   }

   private NewsDTO toNewsDto(Content content) {
      String description = content.getSummary() != null && !content.getSummary().isBlank()
            ? content.getSummary()
            : content.getBody();

      return new NewsDTO(
            content.getId(),
            content.getTitle(),
            description,
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
