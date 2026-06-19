package com.apichinh.backend.controller;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({ "api/image" })
@CrossOrigin(origins = { "*" }, exposedHeaders = { "Content-Range" })
public class ImageController {
   @GetMapping({ "{reSource}/{imageName}" })
   public ResponseEntity<Resource> getImage(@PathVariable String reSource, @PathVariable String imageName)
         throws IOException {
      Path imagePath = Paths.get("image/" + reSource).resolve(imageName);
      Resource resource = new UrlResource(imagePath.toUri());
      if (resource.exists() && resource.isReadable()) {
         HttpHeaders headers = new HttpHeaders();
         headers.setContentType(MediaType.IMAGE_JPEG);
         return new ResponseEntity<>(resource, headers, HttpStatus.OK);
      } else {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
   }

   public ImageController() {
   }
}
