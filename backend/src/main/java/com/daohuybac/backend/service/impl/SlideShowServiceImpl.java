package com.daohuybac.backend.service.impl;

import com.daohuybac.backend.entity.SlideShow;
import com.daohuybac.backend.repository.SlideShowRepository;
import com.daohuybac.backend.service.SlideShowService;
import jakarta.persistence.EntityNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class SlideShowServiceImpl implements SlideShowService {
   private SlideShowRepository slideShowRepository;

   public SlideShow createSlideShow(SlideShow slideShow) {
      return (SlideShow) this.slideShowRepository.save(slideShow);
   }

   public SlideShow getSlideShowById(Long slideShowId) {
      Optional<SlideShow> optionalSlideShow = this.slideShowRepository.findById(slideShowId);
      return (SlideShow) optionalSlideShow.get();
   }

   public Page<SlideShow> getAllCategories(Pageable pageable) {
      return this.slideShowRepository.findAll(pageable);
   }

   public SlideShow updateSlideShow(SlideShow slideShow) {
      SlideShow existingSlideShow = (SlideShow) this.slideShowRepository.findById(slideShow.getId()).get();
      existingSlideShow.setTitle(slideShow.getTitle());
      SlideShow updatedSlideShow = (SlideShow) this.slideShowRepository.save(existingSlideShow);
      return updatedSlideShow;
   }

   public SlideShow updateSlideShowWithFile(Long slideShowId, SlideShow slideShow, MultipartFile file)
         throws IOException {
      SlideShow existingSlideShow = (SlideShow) this.slideShowRepository.findById(slideShowId).orElseThrow(() -> {
         return new EntityNotFoundException("SlideShow not found with id: " + slideShowId);
      });
      if (file != null && !file.isEmpty()) {
         String fileName = StringUtils.cleanPath(file.getOriginalFilename());
         String fileExtension = fileName.substring(fileName.lastIndexOf("."));
         String var10000 = UUID.randomUUID().toString();
         String storedFileName = var10000 + fileExtension;
         Path uploadPath = Paths.get("image/slideShows");
         Files.createDirectories(uploadPath);
         Path filePath = uploadPath.resolve(storedFileName);
         file.transferTo(filePath);
         existingSlideShow.setPhoto(storedFileName);
      }

      existingSlideShow.setTitle(slideShow.getTitle());
      return (SlideShow) this.slideShowRepository.save(existingSlideShow);
   }

   public void deleteSlideShow(Long slideShowId) {
      this.slideShowRepository.deleteById(slideShowId);
   }

   public SlideShow uploadSlideShow(SlideShow slideShow, MultipartFile file) throws IOException {
      String fileName = StringUtils.cleanPath(file.getOriginalFilename());
      String fileExtension = fileName.substring(fileName.lastIndexOf("."));
      String var10000 = UUID.randomUUID().toString();
      String storedFileName = var10000 + fileExtension;
      Path uploadPath = Paths.get("image/slideShows");
      Files.createDirectories(uploadPath);
      Path filePath = uploadPath.resolve(storedFileName);
      file.transferTo(filePath);
      slideShow.setPhoto(storedFileName);
      this.slideShowRepository.save(slideShow);
      return slideShow;
   }

   public SlideShowServiceImpl(final SlideShowRepository slideShowRepository) {
      this.slideShowRepository = slideShowRepository;
   }
}
