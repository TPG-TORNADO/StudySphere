package com.studysphere.dto;

import com.studysphere.entity.DiscussionPost;
import java.time.LocalDateTime;

public record DiscussionPostResponse(
        Long id,
        String title,
        String content,
        UserSummaryResponse author,
        Long studyGroupId,
        LocalDateTime createdAt
) {
    public static DiscussionPostResponse from(DiscussionPost post) {
        return new DiscussionPostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                UserSummaryResponse.from(post.getAuthor()),
                post.getStudyGroup().getId(),
                post.getCreatedAt()
        );
    }
}

