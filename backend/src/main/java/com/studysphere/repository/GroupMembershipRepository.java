package com.studysphere.repository;

import com.studysphere.entity.GroupMembership;
import com.studysphere.entity.GroupMembershipId;
import com.studysphere.entity.StudyGroup;
import com.studysphere.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupMembershipRepository extends JpaRepository<GroupMembership, GroupMembershipId> {

    boolean existsByUserAndStudyGroup(User user, StudyGroup studyGroup);

    List<GroupMembership> findByUserOrderByJoinedAtDesc(User user);

    List<GroupMembership> findByStudyGroupOrderByJoinedAtAsc(StudyGroup studyGroup);

    long countByUser(User user);

    long countByUserId(Long userId);

    void deleteByUserAndStudyGroup(User user, StudyGroup studyGroup);
}
