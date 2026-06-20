package com.studysphere.dto;

import com.studysphere.entity.Comment;
import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        String content,
        UserSummaryResponse author,
        Long discussionPostId,
        LocalDateTime createdAt
) {
    public static CommentResponse from(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                UserSummaryResponse.from(comment.getAuthor()),
                comment.getDiscussionPost().getId(),
                comment.getCreatedAt()
        );
    }
}

