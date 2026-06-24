package com.apichinh.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;

@RestController
@RequestMapping("/api/image")
@CrossOrigin(origins = "*", exposedHeaders = "Content-Range")
public class ImageController {

    // Inject the path from application.properties.
    // This makes the path configurable and not dependent on the execution directory.
    // It defaults to a folder named "image" at the same level as the running application.
    @Value("${app.image-storage-path:image}")
    private String storageFolder;

    @GetMapping("/{resourceFolder}/{imageName:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String resourceFolder, @PathVariable String imageName) {
        try {
            Path imagePath = Paths.get(storageFolder, resourceFolder, imageName);
            Resource resource = new UrlResource(imagePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                HttpHeaders headers = new HttpHeaders();
                String contentType = Files.probeContentType(imagePath);
                if ((contentType == null || MediaType.APPLICATION_OCTET_STREAM_VALUE.equals(contentType))
                        && imageName.toLowerCase(Locale.ROOT).endsWith(".svg")) {
                    contentType = "image/svg+xml";
                }
                headers.setContentType(contentType != null ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_OCTET_STREAM);
                return new ResponseEntity<>(resource, headers, HttpStatus.OK);
            } else {
                System.err.println("Image not found at path: " + imagePath.toAbsolutePath());
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (IOException e) {
            System.err.println("Could not read image file: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
