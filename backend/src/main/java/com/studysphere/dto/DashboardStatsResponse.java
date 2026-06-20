package com.studysphere.dto;

public record DashboardStatsResponse(
        long groupsJoined,
        long resourcesUploaded,
        long discussionPosts,
        long membersConnected) {
}
