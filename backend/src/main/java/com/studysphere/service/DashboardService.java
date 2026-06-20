package com.studysphere.service;

import com.studysphere.dto.DashboardStatsResponse;
import com.studysphere.entity.User;
import com.studysphere.repository.DiscussionPostRepository;
import com.studysphere.repository.GroupMembershipRepository;
import com.studysphere.repository.ResourceRepository;
import com.studysphere.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final GroupMembershipRepository groupMembershipRepository;
    private final ResourceRepository resourceRepository;
    private final DiscussionPostRepository discussionPostRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public DashboardService(
            GroupMembershipRepository groupMembershipRepository,
            ResourceRepository resourceRepository,
            DiscussionPostRepository discussionPostRepository,
            UserRepository userRepository,
            CurrentUserService currentUserService) {
        this.groupMembershipRepository = groupMembershipRepository;
        this.resourceRepository = resourceRepository;
        this.discussionPostRepository = discussionPostRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        User user = currentUserService.getCurrentUser();
        long groupsJoined = groupMembershipRepository.countByUser(user);
        long resourcesUploaded = resourceRepository.countByUploadedBy(user);
        long discussionPosts = discussionPostRepository.countByAuthor(user);
        long membersConnected = userRepository.countMembersInUserGroups(user);

        return new DashboardStatsResponse(
                groupsJoined,
                resourcesUploaded,
                discussionPosts,
                membersConnected);
    }
}
