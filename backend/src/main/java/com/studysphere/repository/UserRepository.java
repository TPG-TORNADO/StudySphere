package com.studysphere.repository;

import com.studysphere.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT m2.user) FROM GroupMembership m1 JOIN GroupMembership m2 ON m1.studyGroup = m2.studyGroup WHERE m1.user = :user")
    long countMembersInUserGroups(User user);
}

