package com.studysphere.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentRequest(
        @NotBlank(message = "Comment content is required")
        @Size(max = 2000, message = "Comment must be 2000 characters or less")
        String content
) {
}

