package com.studysphere.dto;

public record UpdateProfileRequest(
        String fullName,
        String bio) {
}