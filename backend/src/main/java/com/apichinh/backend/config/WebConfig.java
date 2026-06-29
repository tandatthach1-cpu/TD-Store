package com.apichinh.backend.config;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
   @Value("${APP_CORS_ALLOWED_ORIGINS:http://localhost:3000,http://localhost:3001,http://localhost:5173,http://127.0.0.1:5173}")
   private String allowedOrigins;

   @Override
   public void addCorsMappings(CorsRegistry registry) {
      List<String> origins = Arrays.stream(allowedOrigins.split(","))
            .map(String::trim)
            .filter(origin -> !origin.isBlank())
            .collect(Collectors.toList());

      registry.addMapping("/api/**")
            .allowedOrigins(origins.toArray(new String[0]))
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .exposedHeaders("Content-Range")
            .allowCredentials(false)
            .maxAge(3600);
   }
}
