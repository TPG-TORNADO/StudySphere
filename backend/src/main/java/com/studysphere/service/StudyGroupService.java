package com.studysphere.service;

import com.studysphere.dto.GroupMembershipResponse;
import com.studysphere.dto.StudyGroupRequest;
import com.studysphere.dto.StudyGroupResponse;
import com.studysphere.entity.NotificationType;
import com.studysphere.entity.GroupMembership;
import com.studysphere.entity.StudyGroup;
import com.studysphere.entity.User;
import com.studysphere.repository.GroupMembershipRepository;
import com.studysphere.repository.StudyGroupRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudyGroupService {

    private final StudyGroupRepository studyGroupRepository;
    private final GroupMembershipRepository membershipRepository;
    private final CurrentUserService currentUserService;

    private final NotificationService notificationService;

    public StudyGroupService(
            StudyGroupRepository studyGroupRepository,
            GroupMembershipRepository membershipRepository,
            CurrentUserService currentUserService,
            NotificationService notificationService) {
        this.studyGroupRepository = studyGroupRepository;
        this.membershipRepository = membershipRepository;
        this.currentUserService = currentUserService;
        this.notificationService = notificationService;
    }

    @Transactional
    public StudyGroupResponse createGroup(StudyGroupRequest request) {
        User user = currentUserService.getCurrentUser();

        StudyGroup group = new StudyGroup();
        group.setName(request.name());
        group.setDescription(request.description());
        group.setCreatedBy(user);
        StudyGroup savedGroup = studyGroupRepository.save(group);

        GroupMembership membership = new GroupMembership();
        membership.setUser(user);
        membership.setStudyGroup(savedGroup);
        membershipRepository.save(membership);

        return StudyGroupResponse.from(savedGroup);
    }

    @Transactional(readOnly = true)
    public List<StudyGroupResponse> getAllGroups() {
        return studyGroupRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(StudyGroupResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<StudyGroupResponse> searchGroups(String query) {
        String normalizedQuery = query == null ? "" : query.trim();
        if (normalizedQuery.isEmpty()) {
            return getAllGroups();
        }

        return studyGroupRepository
                .findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrderByCreatedAtDesc(
                        normalizedQuery,
                        normalizedQuery)
                .stream()
                .map(StudyGroupResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public StudyGroupResponse getGroup(Long groupId) {
        return StudyGroupResponse.from(findGroup(groupId));
    }

    @Transactional
    public GroupMembershipResponse joinGroup(Long groupId) {
        User user = currentUserService.getCurrentUser();
        StudyGroup group = findGroup(groupId);

        if (membershipRepository.existsByUserAndStudyGroup(user, group)) {
            throw new IllegalArgumentException("User is already a member of this group");
        }

        GroupMembership membership = new GroupMembership();
        membership.setUser(user);
        membership.setStudyGroup(group);
        GroupMembership saved = membershipRepository.save(membership);

        notificationService.createNotification(
            group.getCreatedBy(),
            user.getFullName() + " joined your group: " + group.getName(),
            NotificationType.GROUP_JOIN,
            group.getId(),
            "GROUP",
            group.getId(),
            null
        );

        return GroupMembershipResponse.from(saved);
    }

    @Transactional
    public void leaveGroup(Long groupId) {
        User user = currentUserService.getCurrentUser();
        StudyGroup group = findGroup(groupId);

        if (!membershipRepository.existsByUserAndStudyGroup(user, group)) {
            throw new IllegalArgumentException("User is not a member of this group");
        }
        membershipRepository.deleteByUserAndStudyGroup(user, group);
    }

    @Transactional(readOnly = true)
    public List<GroupMembershipResponse> getMembers(Long groupId) {
        StudyGroup group = findGroup(groupId);
        return membershipRepository.findByStudyGroupOrderByJoinedAtAsc(group)
                .stream()
                .map(GroupMembershipResponse::from)
                .toList();
    }

    public StudyGroup findGroup(Long groupId) {
        return studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Study group not found"));
    }

    public void requireMembership(User user, StudyGroup group) {
        if (!membershipRepository.existsByUserAndStudyGroup(user, group)) {
            throw new IllegalArgumentException("Join this group before using this feature");
        }
    }
}
