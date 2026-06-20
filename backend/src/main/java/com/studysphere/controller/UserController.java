package com.studysphere.controller;

import com.studysphere.dto.ProfileResponse;
import com.studysphere.dto.UpdateProfileRequest;
import com.studysphere.entity.User;
import com.studysphere.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.studysphere.dto.UploadProfileImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping("/profile")
    public ProfileResponse updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {

        User user = (User) authentication.getPrincipal();

        user.setFullName(request.fullName());
        user.setBio(request.bio());

        User savedUser = userRepository.save(user);

        return new ProfileResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getBio(),
                savedUser.getRole().name(),
                savedUser.getProfileImage());
    }

    @GetMapping("/profile")
    public ProfileResponse getProfile(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return new ProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getBio(),
                user.getRole().name(),
                user.getProfileImage());
    }

    @PostMapping("/profile-picture")
    public UploadProfileImageResponse uploadProfileImage(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) throws IOException {

        User user = (User) authentication.getPrincipal();

        String uploadDir = System.getProperty("user.dir")
                + File.separator
                + "uploads"
                + File.separator
                + "profile-images";

        File directory = new File(uploadDir);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null || originalFileName.isBlank()) {
            originalFileName = "profile.jpg";
        }

        // Remove invalid Windows filename characters
        originalFileName = originalFileName.replaceAll("[\\\\/:*?\"<>| ]", "_");

        String fileName = UUID.randomUUID() + "_" + originalFileName;

        File destination = new File(directory, fileName);

        System.out.println("Saving image to:");
        System.out.println(destination.getAbsolutePath());

        file.transferTo(destination);

        String imageUrl = "/uploads/profile-images/" + fileName;

        user.setProfileImage(imageUrl);

        userRepository.save(user);

        return new UploadProfileImageResponse(imageUrl);
    }
}