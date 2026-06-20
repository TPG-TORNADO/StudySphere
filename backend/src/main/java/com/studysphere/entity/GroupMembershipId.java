package com.studysphere.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class GroupMembershipId implements Serializable {

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "study_group_id")
    private Long studyGroupId;

    public GroupMembershipId() {
    }

    public GroupMembershipId(Long userId, Long studyGroupId) {
        this.userId = userId;
        this.studyGroupId = studyGroupId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getStudyGroupId() {
        return studyGroupId;
    }

    public void setStudyGroupId(Long studyGroupId) {
        this.studyGroupId = studyGroupId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GroupMembershipId that)) {
            return false;
        }
        return Objects.equals(userId, that.userId)
                && Objects.equals(studyGroupId, that.studyGroupId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, studyGroupId);
    }
}

