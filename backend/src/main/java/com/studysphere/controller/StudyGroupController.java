package com.studysphere.controller;

import com.studysphere.dto.GroupMembershipResponse;
import com.studysphere.dto.StudyGroupRequest;
import com.studysphere.dto.StudyGroupResponse;
import com.studysphere.service.StudyGroupService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/groups")
public class StudyGroupController {

    private final StudyGroupService studyGroupService;

    public StudyGroupController(StudyGroupService studyGroupService) {
        this.studyGroupService = studyGroupService;
    }

    @PostMapping
    public ResponseEntity<StudyGroupResponse> createGroup(@Valid @RequestBody StudyGroupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studyGroupService.createGroup(request));
    }

    @GetMapping
    public ResponseEntity<List<StudyGroupResponse>> getAllGroups() {
        return ResponseEntity.ok(studyGroupService.getAllGroups());
    }

    @GetMapping("/search")
    public ResponseEntity<List<StudyGroupResponse>> searchGroups(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(studyGroupService.searchGroups(query));
    }

    @GetMapping("/{groupId:\\d+}")
    public ResponseEntity<StudyGroupResponse> getGroup(@PathVariable Long groupId) {
        return ResponseEntity.ok(studyGroupService.getGroup(groupId));
    }

    @PostMapping("/{groupId:\\d+}/join")
    public ResponseEntity<GroupMembershipResponse> joinGroup(@PathVariable Long groupId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studyGroupService.joinGroup(groupId));
    }

    @DeleteMapping("/{groupId:\\d+}/leave")
    public ResponseEntity<Void> leaveGroup(@PathVariable Long groupId) {
        studyGroupService.leaveGroup(groupId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{groupId:\\d+}/members")
    public ResponseEntity<List<GroupMembershipResponse>> getMembers(@PathVariable Long groupId) {
        return ResponseEntity.ok(studyGroupService.getMembers(groupId));
    }
}
