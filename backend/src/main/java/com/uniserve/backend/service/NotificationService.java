package com.uniserve.backend.service;

import com.uniserve.backend.entity.Notification;
import com.uniserve.backend.entity.User;
import com.uniserve.backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import com.uniserve.backend.entity.Role;
import com.uniserve.backend.entity.ServiceRequest;
import com.uniserve.backend.repository.UserRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

public NotificationService(
        NotificationRepository notificationRepository,
        UserRepository userRepository) {

    this.notificationRepository = notificationRepository;
    this.userRepository = userRepository;
}

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository
                .findByUserAndReadFalseOrderByCreatedAtDesc(user);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndReadFalse(user);
    }

    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void notifyAdmins(
        ServiceRequest request,
        String message) {

    List<User> admins =
            userRepository.findByRoleAndActiveTrue(Role.ADMIN);

    for (User admin : admins) {

        Notification notification =
                new Notification();

        notification.setUser(admin);
        notification.setRequest(request);
        notification.setMessage(message);

        notificationRepository.save(notification);
    }
}

public void notifyRequester(
        ServiceRequest request,
        User requester,
        String message) {

    Notification notification =
            new Notification();

    notification.setUser(requester);
    notification.setRequest(request);
    notification.setMessage(message);

    notificationRepository.save(notification);
}


public void notifyAssignedStaff(
        ServiceRequest request,
        User assignedTo,
        User assignedBy) {

    if (assignedTo == null) {
        return;
    }

    Notification notification =
            new Notification();

    notification.setUser(assignedTo);
    notification.setRequest(request);
    notification.setMessage(
            "Request "
                    + request.getRequestNumber()
                    + " has been assigned to you by "
                    + assignedBy.getFullName()
                    + "."
    );

    notificationRepository.save(notification);
}


    public Notification markAsRead(Notification notification) {
        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());

        return notificationRepository.save(notification);
    }
}