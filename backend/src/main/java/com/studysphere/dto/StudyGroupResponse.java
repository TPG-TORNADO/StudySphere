package com.studysphere.dto;

import com.studysphere.entity.StudyGroup;
import java.time.LocalDateTime;

public record StudyGroupResponse(
        Long id,
        String name,
        String description,
        UserSummaryResponse createdBy,
        LocalDateTime createdAt
) {
    public static StudyGroupResponse from(StudyGroup studyGroup) {
        return new StudyGroupResponse(
                studyGroup.getId(),
                studyGroup.getName(),
                studyGroup.getDescription(),
                UserSummaryResponse.from(studyGroup.getCreatedBy()),
                studyGroup.getCreatedAt()
        );
    }
}

