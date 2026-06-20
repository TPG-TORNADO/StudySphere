package com.studysphere.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DiscussionPostRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 160, message = "Title must be 160 characters or less")
        String title,

        @NotBlank(message = "Content is required")
        String content
) {
}

