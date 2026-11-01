package com.uniserve.backend.controller;

import com.uniserve.backend.dto.notification.NotificationResponse;
import com.uniserve.backend.entity.Notification;
import com.uniserve.backend.entity.User;
import com.uniserve.backend.repository.NotificationRepository;
import com.uniserve.backend.repository.UserRepository;
import com.uniserve.backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@PreAuthorize("isAuthenticated()")
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationController(
            NotificationService notificationService,
            NotificationRepository notificationRepository,
            UserRepository userRepository) {
        this.notificationService = notificationService;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            Authentication authentication) {

        User currentUser = getAuthenticatedUser(authentication);

        List<NotificationResponse> notifications =
                notificationService.getUserNotifications(currentUser)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(
            Authentication authentication) {

        User currentUser = getAuthenticatedUser(authentication);

        List<NotificationResponse> notifications =
                notificationService.getUnreadNotifications(currentUser)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount(
            Authentication authentication) {

        User currentUser = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                notificationService.getUnreadCount(currentUser)
        );
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {

        User currentUser = getAuthenticatedUser(authentication);

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Notification not found."
                                ));

        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalStateException(
                    "You can only access your own notifications."
            );
        }

        Notification updatedNotification =
                notificationService.markAsRead(notification);

        return ResponseEntity.ok(toResponse(updatedNotification));
    }

    private User getAuthenticatedUser(Authentication authentication) {

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user not found."
                        ));
    }

    private NotificationResponse toResponse(Notification notification) {

        NotificationResponse response = new NotificationResponse();

        response.setId(notification.getId());

        if (notification.getRequest() != null) {
            response.setRequestId(notification.getRequest().getId());
            response.setRequestNumber(
                    notification.getRequest().getRequestNumber()
            );
        }

        response.setMessage(notification.getMessage());
        response.setRead(notification.isRead());
        response.setCreatedAt(notification.getCreatedAt());
        response.setReadAt(notification.getReadAt());

        return response;
    }
}