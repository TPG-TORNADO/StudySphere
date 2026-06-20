package com.studysphere.dto;

import com.studysphere.entity.User;

public record UserSummaryResponse(
        Long id,
        String fullName,
        String email
) {
    public static UserSummaryResponse from(User user) {
        return new UserSummaryResponse(user.getId(), user.getFullName(), user.getEmail());
    }
}

