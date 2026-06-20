package com.studysphere.controller;

import com.studysphere.dto.CommentRequest;
import com.studysphere.dto.CommentResponse;
import com.studysphere.dto.DiscussionPostRequest;
import com.studysphere.dto.DiscussionPostResponse;
import com.studysphere.service.DiscussionService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DiscussionController {

    private final DiscussionService discussionService;

    public DiscussionController(DiscussionService discussionService) {
        this.discussionService = discussionService;
    }

    @PostMapping("/groups/{groupId}/posts")
    public ResponseEntity<DiscussionPostResponse> createPost(
            @PathVariable Long groupId,
            @Valid @RequestBody DiscussionPostRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(discussionService.createPost(groupId, request));
    }

    @GetMapping("/groups/{groupId}/posts")
    public ResponseEntity<List<DiscussionPostResponse>> getPosts(@PathVariable Long groupId) {
        return ResponseEntity.ok(discussionService.getPosts(groupId));
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<DiscussionPostResponse> getPost(@PathVariable Long postId) {
        return ResponseEntity.ok(discussionService.getPost(postId));
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(discussionService.addComment(postId, request));
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(discussionService.getComments(postId));
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        discussionService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }
}
