package com.studysphere.service;

import com.studysphere.dto.ResourceResponse;
import com.studysphere.entity.NotificationType;
import com.studysphere.entity.StudyGroup;
import com.studysphere.entity.User;
import com.studysphere.repository.ResourceRepository;
import com.studysphere.repository.GroupMembershipRepository;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final StudyGroupService studyGroupService;
    private final CurrentUserService currentUserService;
    private final GroupMembershipRepository membershipRepository;
    private final NotificationService notificationService;
    private final Path uploadRoot;

    public ResourceService(
            ResourceRepository resourceRepository,
            StudyGroupService studyGroupService,
            CurrentUserService currentUserService,
            GroupMembershipRepository membershipRepository,
            NotificationService notificationService,
            @Value("${app.upload.dir}") String uploadDir) {
        this.resourceRepository = resourceRepository;
        this.studyGroupService = studyGroupService;
        this.currentUserService = currentUserService;
        this.membershipRepository = membershipRepository;
        this.notificationService = notificationService;
        this.uploadRoot = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    @Transactional
    public ResourceResponse uploadResource(Long groupId, MultipartFile file) {
        User user = currentUserService.getCurrentUser();
        StudyGroup group = studyGroupService.findGroup(groupId);
        studyGroupService.requireMembership(user, group);
        validatePdf(file);

        String rawName = file.getOriginalFilename();
        if (rawName == null) {
            throw new IllegalArgumentException("Invalid file name");
        }
        String cleanedName = StringUtils.cleanPath(rawName);
        String storedName = UUID.randomUUID() + "-" + cleanedName;
        Path groupDirectory = uploadRoot.resolve("groups").resolve(groupId.toString()).normalize();
        Path targetPath = groupDirectory.resolve(storedName).normalize();

        if (!targetPath.startsWith(groupDirectory)) {
            throw new IllegalArgumentException("Invalid file name");
        }

        try {
            Files.createDirectories(groupDirectory);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException ex) {
            throw new IllegalStateException("Could not store file", ex);
        }

        com.studysphere.entity.Resource res = new com.studysphere.entity.Resource();
        res.setFileName(cleanedName);
        res.setFilePath(targetPath.toString());
        res.setUploadedBy(user);
        res.setStudyGroup(group);

        com.studysphere.entity.Resource saved = resourceRepository.save(res);

        membershipRepository.findByStudyGroupOrderByJoinedAtAsc(group).forEach(membership -> {
            User recipient = membership.getUser();
            if (!recipient.getId().equals(user.getId())) {
                notificationService.createNotification(
                        recipient,
                        "New resource in " + group.getName() + ": " + cleanedName,
                        NotificationType.RESOURCE_UPLOAD,
                        group.getId(),
                        "RESOURCE",
                        saved.getId(),
                        group.getId());
            }
        });

        return ResourceResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<ResourceResponse> getResources(Long groupId) {
        StudyGroup group = studyGroupService.findGroup(groupId);
        return resourceRepository.findByStudyGroupOrderByUploadedAtDesc(group)
                .stream()
                .map(ResourceResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ResourceResponse> searchResources(String query) {
        String normalizedQuery = query == null ? "" : query.trim();
        if (normalizedQuery.isEmpty()) {
            return resourceRepository.findAll().stream()
                    .map(ResourceResponse::from)
                    .toList();
        }

        return resourceRepository.findAll().stream()
                .filter(resource -> resource.getFileName().toLowerCase().contains(normalizedQuery.toLowerCase()))
                .map(ResourceResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public com.studysphere.entity.Resource getResourceEntity(@NonNull Long resourceId) {
        return resourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found"));
    }

    public org.springframework.core.io.Resource loadFile(com.studysphere.entity.Resource resource) {
        try {
            Path filePath = Path.of(resource.getFilePath()).toAbsolutePath().normalize();
            UrlResource fileResource = new UrlResource(filePath.toUri());
            if (fileResource.exists() && fileResource.isReadable()) {
                return fileResource;
            }
            throw new IllegalArgumentException("Stored file is not readable");
        } catch (IOException ex) {
            throw new IllegalStateException("Could not load file", ex);
        }
    }

    private void validatePdf(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("PDF file is required");
        }

        String rawName = file.getOriginalFilename();
        if (rawName == null) {
            throw new IllegalArgumentException("Invalid file name");
        }
        String validatedName = StringUtils.cleanPath(rawName);
        if (!StringUtils.hasText(validatedName) || validatedName.contains("..")) {
            throw new IllegalArgumentException("Invalid file name");
        }

        boolean hasExt = validatedName.toLowerCase().endsWith(".pdf");
        String pdfContentType = file.getContentType();
        boolean hasType = pdfContentType == null || "application/pdf".equalsIgnoreCase(pdfContentType);

        if (!hasExt || !hasType) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }
    }
}