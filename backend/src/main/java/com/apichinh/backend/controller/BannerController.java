package com.apichinh.backend.controller;

import com.apichinh.backend.entity.Banner;
import com.apichinh.backend.repository.BannerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
@RequestMapping("/api/banners")
@CrossOrigin(origins = "*", exposedHeaders = { "Content-Range" })
public class BannerController extends AdminCrudController<Banner, Long> {
   private final BannerRepository bannerRepository;

   public BannerController(BannerRepository bannerRepository) {
      this.bannerRepository = bannerRepository;
   }

   @GetMapping
   public ResponseEntity<Page<Banner>> getAll(
         @RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "10") int size) {
      return ResponseEntity.ok(bannerRepository.findAll(PageRequest.of(page, size)));
   }

   @GetMapping("{id}")
   public ResponseEntity<Banner> getById(@PathVariable Long id) {
      return getOne(bannerRepository, id);
   }

   @PostMapping
   public ResponseEntity<Banner> createItem(@RequestBody Banner banner) {
      return create(bannerRepository, banner);
   }

   @PutMapping("{id}")
   public ResponseEntity<Banner> updateItem(@PathVariable Long id, @RequestBody Banner banner) {
      banner.setId(id);
      return update(bannerRepository, id, banner);
   }

   @DeleteMapping("{id}")
   public ResponseEntity<String> deleteItem(@PathVariable Long id) {
      return delete(bannerRepository, id);
   }
}
