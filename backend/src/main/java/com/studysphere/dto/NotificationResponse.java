package com.studysphere.dto;

import com.studysphere.entity.Notification;
import com.studysphere.entity.NotificationType;
import java.time.LocalDateTime;

public record NotificationResponse(
    Long id,
    String message,
    NotificationType type,
    Long relatedId,
    String targetType,
    Long targetId,
    Long targetParentId,
    boolean isRead,
    LocalDateTime createdAt
) {
    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(
            n.getId(),
            n.getMessage(),
            n.getType(),
            n.getRelatedId(),
            n.getTargetType(),
            n.getTargetId(),
            n.getTargetParentId(),
            n.isRead(),
            n.getCreatedAt()
        );
    }
}
