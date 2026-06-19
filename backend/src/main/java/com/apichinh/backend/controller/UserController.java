package com.apichinh.backend.controller;

import com.apichinh.backend.entity.User;
import com.apichinh.backend.service.UserService;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping({ "api/users" })
@CrossOrigin(origins = { "*" }, exposedHeaders = { "Content-Range" })
public class UserController {
    private UserService userService;

    public UserController(final UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.createUser(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PostMapping("/adduser")
    public ResponseEntity<?> addUser(@ModelAttribute User user,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        User savedUser;
        try {
            if (file != null && !file.isEmpty()) {
                savedUser = userService.uploadUser(user, file);
            } else {
                savedUser = userService.createUser(user);
            }
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Error uploading image.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<Page<User>> getUsers(@RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userService.getAllUser(pageable);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/name/{userName}")
    public ResponseEntity<User> getUser(@PathVariable("userName") String username) {
        User user = userService.getUser(username);
        return user != null ? new ResponseEntity<>(user, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable("email") String email) {
        User user = userService.getUserByEmail(email);
        return user != null ? new ResponseEntity<>(user, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // New endpoint to fetch user by phone number
    @GetMapping("/phone/{phone}")
    public ResponseEntity<User> getUserByPhone(@PathVariable("phone") String phone) {
        User user = userService.getUserByPhone(phone);
        return user != null ? new ResponseEntity<>(user, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> loginWithGoogle(@RequestBody User user) {
        try {
            User savedUser = userService.loginWithGoogle(user);
            return new ResponseEntity<>(savedUser, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long userId) {
        User user = userService.getUserById(userId);
        return user != null ? new ResponseEntity<>(user, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable("id") Long userId,
            @ModelAttribute User user,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        User existingUser = userService.getUserById(userId);
        if (existingUser == null) {
            return new ResponseEntity<>("User not found.", HttpStatus.NOT_FOUND);
        }

        User updatedUser;
        try {
            if (file != null && !file.isEmpty()) {
                updatedUser = userService.updateUserWithFile(userId, user, file);
            } else {
                user.setId(userId); // Set the existing ID to update
                updatedUser = userService.updateUser(user);
            }
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error uploading image.", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") Long userId) {
        userService.deleteUser(userId);
        return new ResponseEntity<>("User successfully deleted!", HttpStatus.OK);
    }



}
