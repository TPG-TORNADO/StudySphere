package com.studysphere.repository;

import com.studysphere.entity.StudyGroup;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {

    List<StudyGroup> findAllByOrderByCreatedAtDesc();

    List<StudyGroup> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrderByCreatedAtDesc(
            String name,
            String description);
}
