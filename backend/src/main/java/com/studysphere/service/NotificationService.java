package com.studysphere.service;

import com.studysphere.dto.NotificationResponse;
import com.studysphere.entity.Notification;
import com.studysphere.entity.NotificationType;
import com.studysphere.entity.User;
import com.studysphere.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final CurrentUserService currentUserService;

    public NotificationService(NotificationRepository notificationRepository, CurrentUserService currentUserService) {
        this.notificationRepository = notificationRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public void createNotification(User recipient, String message, NotificationType type, Long relatedId, String targetType, Long targetId, Long targetParentId) {
        Notification n = new Notification();
        n.setRecipient(recipient);
        n.setMessage(message);
        n.setType(type);
        n.setRelatedId(relatedId);
        n.setTargetType(targetType);
        n.setTargetId(targetId);
        n.setTargetParentId(targetParentId);
        notificationRepository.save(n);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications() {
        User user = currentUserService.getCurrentUser();
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user)
            .stream().map(NotificationResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        User user = currentUserService.getCurrentUser();
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }

    @Transactional
    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> n.setRead(true));
    }
}
