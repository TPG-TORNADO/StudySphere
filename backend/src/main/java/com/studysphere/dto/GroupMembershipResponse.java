package com.studysphere.dto;

import com.studysphere.entity.GroupMembership;
import java.time.LocalDateTime;

public record GroupMembershipResponse(
        UserSummaryResponse user,
        StudyGroupResponse studyGroup,
        LocalDateTime joinedAt
) {
    public static GroupMembershipResponse from(GroupMembership membership) {
        return new GroupMembershipResponse(
                UserSummaryResponse.from(membership.getUser()),
                StudyGroupResponse.from(membership.getStudyGroup()),
                membership.getJoinedAt()
        );
    }
}

