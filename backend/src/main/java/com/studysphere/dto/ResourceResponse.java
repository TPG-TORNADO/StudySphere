package com.studysphere.dto;

import com.studysphere.entity.Resource;
import java.time.LocalDateTime;

public record ResourceResponse(
        Long id,
        String fileName,
        UserSummaryResponse uploadedBy,
        Long studyGroupId,
        LocalDateTime uploadedAt
) {
    public static ResourceResponse from(Resource resource) {
        return new ResourceResponse(
                resource.getId(),
                resource.getFileName(),
                UserSummaryResponse.from(resource.getUploadedBy()),
                resource.getStudyGroup().getId(),
                resource.getUploadedAt()
        );
    }
}

