package com.studysphere.repository;

import com.studysphere.entity.Resource;
import com.studysphere.entity.StudyGroup;
import com.studysphere.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByStudyGroupOrderByUploadedAtDesc(StudyGroup studyGroup);

    long countByUploadedBy(User uploadedBy);

    long countByUploadedById(Long uploadedById);
}
