package com.studysphere.service;

import com.studysphere.dto.CommentRequest;
import com.studysphere.dto.CommentResponse;
import com.studysphere.dto.DiscussionPostRequest;
import com.studysphere.dto.DiscussionPostResponse;
import com.studysphere.entity.NotificationType;
import com.studysphere.entity.Comment;
import com.studysphere.entity.DiscussionPost;
import com.studysphere.entity.StudyGroup;
import com.studysphere.entity.User;
import com.studysphere.repository.CommentRepository;
import com.studysphere.repository.DiscussionPostRepository;
import java.util.List;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DiscussionService {

    private final DiscussionPostRepository discussionPostRepository;
    private final CommentRepository commentRepository;
    private final StudyGroupService studyGroupService;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;

    public DiscussionService(
            DiscussionPostRepository discussionPostRepository,
            CommentRepository commentRepository,
            StudyGroupService studyGroupService,
            CurrentUserService currentUserService,
            NotificationService notificationService
    ) {
        this.discussionPostRepository = discussionPostRepository;
        this.commentRepository = commentRepository;
        this.studyGroupService = studyGroupService;
        this.currentUserService = currentUserService;
        this.notificationService = notificationService;
    }

    @Transactional
    public DiscussionPostResponse createPost(Long groupId, DiscussionPostRequest request) {
        User user = currentUserService.getCurrentUser();
        StudyGroup group = studyGroupService.findGroup(groupId);
        studyGroupService.requireMembership(user, group);

        DiscussionPost post = new DiscussionPost();
        post.setTitle(request.title());
        post.setContent(request.content());
        post.setAuthor(user);
        post.setStudyGroup(group);

        return DiscussionPostResponse.from(discussionPostRepository.save(post));
    }

    @Transactional(readOnly = true)
    public List<DiscussionPostResponse> getPosts(Long groupId) {
        StudyGroup group = studyGroupService.findGroup(groupId);
        return discussionPostRepository.findByStudyGroupOrderByCreatedAtDesc(group)
                .stream()
                .map(DiscussionPostResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public DiscussionPostResponse getPost(Long postId) {
        return DiscussionPostResponse.from(findPost(postId));
    }

    @Transactional
    public CommentResponse addComment(Long postId, CommentRequest request) {
        User user = currentUserService.getCurrentUser();
        DiscussionPost post = findPost(postId);
        studyGroupService.requireMembership(user, post.getStudyGroup());

        Comment comment = new Comment();
        comment.setContent(request.content());
        comment.setAuthor(user);
        comment.setDiscussionPost(post);

        Comment saved = commentRepository.save(comment);

        if (!post.getAuthor().getId().equals(user.getId())) {
            notificationService.createNotification(
                post.getAuthor(),
                user.getFullName() + " replied to your post: " + post.getTitle(),
                NotificationType.POST_REPLY,
                post.getId(),
                "DISCUSSION",
                post.getId(),
                post.getStudyGroup().getId()
            );
        }

        return CommentResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(Long postId) {
        DiscussionPost post = findPost(postId);
        return commentRepository.findByDiscussionPostOrderByCreatedAtAsc(post)
                .stream()
                .map(CommentResponse::from)
                .toList();
    }

    @Transactional
    public void deletePost(Long postId) {
        User user = currentUserService.getCurrentUser();
        DiscussionPost post = findPost(postId);

        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only delete your own posts");
        }

        commentRepository.deleteByDiscussionPost(post);
        discussionPostRepository.delete(post);
    }

    private DiscussionPost findPost(Long postId) {
        return discussionPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Discussion post not found"));
    }
}
