package com.studysphere.repository;

import com.studysphere.entity.Comment;
import com.studysphere.entity.DiscussionPost;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByDiscussionPostOrderByCreatedAtAsc(DiscussionPost discussionPost);

    void deleteByDiscussionPost(DiscussionPost discussionPost);
}
