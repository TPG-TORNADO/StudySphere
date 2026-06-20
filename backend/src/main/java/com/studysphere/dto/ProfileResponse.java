package com.studysphere.dto;

public record ProfileResponse(
        Long id,
        String fullName,
        String email,
        String bio,
        String role,
        String profileImage) {
}