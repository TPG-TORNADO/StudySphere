package com.studysphere.dto;

public record AuthResponse(
                String token,
                Long userId,
                String fullName,
                String email,
                String role,
                String bio,
                String profileImage) {
}