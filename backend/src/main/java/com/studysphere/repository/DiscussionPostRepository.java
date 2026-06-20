package com.studysphere.repository;

import com.studysphere.entity.DiscussionPost;
import com.studysphere.entity.StudyGroup;
import com.studysphere.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscussionPostRepository extends JpaRepository<DiscussionPost, Long> {

    List<DiscussionPost> findByStudyGroupOrderByCreatedAtDesc(StudyGroup studyGroup);

    long countByAuthor(User author);

    long countByAuthorId(Long authorId);
}
