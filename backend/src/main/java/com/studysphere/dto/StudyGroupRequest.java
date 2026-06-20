package com.studysphere.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StudyGroupRequest(
        @NotBlank(message = "Group name is required")
        @Size(max = 120, message = "Group name must be 120 characters or less")
        String name,

        @NotBlank(message = "Description is required")
        @Size(max = 1000, message = "Description must be 1000 characters or less")
        String description
) {
}

