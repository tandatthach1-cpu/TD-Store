package com.daohuybac.backend.controller;

import com.daohuybac.backend.entity.SlideShow;
import com.daohuybac.backend.service.SlideShowService;
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
@RequestMapping({ "api/slideShows" })
@CrossOrigin(origins = { "*" }, exposedHeaders = { "Content-Range" })
public class SlideShowController {
   private SlideShowService slideShowService;

   @PostMapping
   public ResponseEntity<?> addSlideShow(@ModelAttribute SlideShow slideShow,
         @RequestParam(value = "file", required = false) MultipartFile file) {
      SlideShow savedSlideShow;
      if (file != null) {
         try {
            savedSlideShow = this.slideShowService.uploadSlideShow(slideShow, file);
            return new ResponseEntity<>(savedSlideShow, HttpStatus.CREATED);
         } catch (IOException var4) {
            return new ResponseEntity<>("Error uploading image.", HttpStatus.INTERNAL_SERVER_ERROR);
         }
      } else {
         savedSlideShow = this.slideShowService.createSlideShow(slideShow);
         return new ResponseEntity<>(savedSlideShow, HttpStatus.CREATED);
      }
   }

   @GetMapping({ "{id}" })
   public ResponseEntity<SlideShow> getSlideShowById(@PathVariable("id") Long slideShowId) {
      SlideShow slideShow = this.slideShowService.getSlideShowById(slideShowId);
      return slideShow != null ? new ResponseEntity<>(slideShow, HttpStatus.OK)
            : new ResponseEntity<>(HttpStatus.NOT_FOUND);
   }

   @GetMapping
   public ResponseEntity<Page<SlideShow>> getAllSlideShows(@RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "10") int size) {
      Pageable pageable = PageRequest.of(page, size);
      Page<SlideShow> Categories = this.slideShowService.getAllCategories(pageable);
      return new ResponseEntity<>(Categories, HttpStatus.OK);
   }

   @PutMapping({ "{id}" })
   public ResponseEntity<?> updateSlideShow(@PathVariable("id") Long slideShowId, @ModelAttribute SlideShow slideShow,
         @RequestParam(value = "file", required = false) MultipartFile file) {
      SlideShow updatedSlideShow;
      if (file != null) {
         try {
            updatedSlideShow = this.slideShowService.updateSlideShowWithFile(slideShowId, slideShow, file);
            return new ResponseEntity<>(updatedSlideShow, HttpStatus.OK);
         } catch (IOException var5) {
            return new ResponseEntity<>("Error uploading image.", HttpStatus.INTERNAL_SERVER_ERROR);
         }
      } else {
         slideShow.setId(slideShowId);
         updatedSlideShow = this.slideShowService.updateSlideShow(slideShow);
         return new ResponseEntity<>(updatedSlideShow, HttpStatus.OK);
      }
   }

   @DeleteMapping({ "{id}" })
   public ResponseEntity<String> deleteSlideShow(@PathVariable("id") Long slideShowId) {
      this.slideShowService.deleteSlideShow(slideShowId);
      return new ResponseEntity<>("SlideShow successfully deleted!", HttpStatus.OK);
   }

   public SlideShowController(final SlideShowService slideShowService) {
      this.slideShowService = slideShowService;
   }
}
