package com.studysphere.controller;

import com.studysphere.dto.ResourceResponse;
import com.studysphere.service.ResourceService;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping(value = "/groups/{groupId}/resources", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResourceResponse> uploadResource(
            @PathVariable Long groupId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.uploadResource(groupId, file));
    }

    @GetMapping("/groups/{groupId}/resources")
    public ResponseEntity<List<ResourceResponse>> getResources(@PathVariable Long groupId) {
        return ResponseEntity.ok(resourceService.getResources(groupId));
    }

    @GetMapping("/resources/search")
    public ResponseEntity<List<ResourceResponse>> searchResources(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(resourceService.searchResources(query));
    }

    @GetMapping("/resources/{resourceId}/download")
    public ResponseEntity<org.springframework.core.io.Resource> downloadResource(@PathVariable Long resourceId) {
        com.studysphere.entity.Resource resource = resourceService.getResourceEntity(resourceId);
        org.springframework.core.io.Resource file = resourceService.loadFile(resource);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFileName() + "\"")
                .body(file);
    }
}
