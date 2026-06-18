package com.daohuybac.backend.service;

import com.daohuybac.backend.entity.SlideShow;
import java.io.IOException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface SlideShowService {
   String uploadDir = "image/slideShows";

   SlideShow createSlideShow(SlideShow slideShow);

   SlideShow getSlideShowById(Long slideShowId);

   Page<SlideShow> getAllCategories(Pageable pageable);

   SlideShow updateSlideShow(SlideShow slideShow);

   void deleteSlideShow(Long slideShowId);

   SlideShow uploadSlideShow(SlideShow slideShow, MultipartFile file) throws IOException;

   SlideShow updateSlideShowWithFile(Long slideShowId, SlideShow slideShow, MultipartFile file) throws IOException;
}
