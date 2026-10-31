package com.uniserve.backend.controller;

import com.uniserve.backend.dto.feedback.CreateFeedbackRequest;
import com.uniserve.backend.dto.feedback.FeedbackResponse;
import com.uniserve.backend.entity.Feedback;
import com.uniserve.backend.entity.RequestStatus;
import com.uniserve.backend.entity.ServiceRequest;
import com.uniserve.backend.entity.User;
import com.uniserve.backend.repository.UserRepository;
import com.uniserve.backend.service.FeedbackService;
import com.uniserve.backend.service.ServiceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final ServiceRequestService serviceRequestService;
    private final UserRepository userRepository;

    public FeedbackController(
            FeedbackService feedbackService,
            ServiceRequestService serviceRequestService,
            UserRepository userRepository) {

        this.feedbackService = feedbackService;
        this.serviceRequestService = serviceRequestService;
        this.userRepository = userRepository;
    }

    @PostMapping("/{id}/feedback")
    @PreAuthorize("hasAnyRole('STUDENT', 'LECTURER')")
    public ResponseEntity<FeedbackResponse> createFeedback(
            @PathVariable Long id,
            @Valid @RequestBody CreateFeedbackRequest feedbackRequest,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        ServiceRequest request =
                serviceRequestService.getRequestById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Service request not found."
                                )
                        );

        if (request.getSubmittedBy() == null
                || !request.getSubmittedBy()
                        .getId()
                        .equals(currentUser.getId())) {

            throw new IllegalStateException(
                    "You can only provide feedback for your own requests."
            );
        }

        if (request.getStatus() != RequestStatus.RESOLVED
                && request.getStatus() != RequestStatus.CLOSED) {

            throw new IllegalStateException(
                    "Feedback can only be submitted for resolved or closed requests."
            );
        }

        if (feedbackService.feedbackExists(request, currentUser)) {

            throw new IllegalStateException(
                    "Feedback has already been submitted for this request."
            );
        }

        Feedback feedback = new Feedback();

        feedback.setRequest(request);
        feedback.setUser(currentUser);
        feedback.setRating(feedbackRequest.getRating());
        feedback.setComment(feedbackRequest.getComment());

        Feedback savedFeedback =
                feedbackService.saveFeedback(feedback);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toFeedbackResponse(savedFeedback));
    }

    @GetMapping("/{id}/feedback")
    @PreAuthorize("hasAnyRole('STUDENT', 'LECTURER')")
    public ResponseEntity<FeedbackResponse> getFeedback(
            @PathVariable Long id,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        ServiceRequest request =
                serviceRequestService.getRequestById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Service request not found."
                                )
                        );

        if (request.getSubmittedBy() == null
                || !request.getSubmittedBy()
                        .getId()
                        .equals(currentUser.getId())) {

            throw new IllegalStateException(
                    "You can only view feedback for your own requests."
            );
        }

        Feedback feedback =
                feedbackService.getFeedback(request, currentUser)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "No feedback found for this request."
                                )
                        );

        return ResponseEntity.ok(toFeedbackResponse(feedback));
    }

    private User getCurrentUser(Authentication authentication) {

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user not found."
                        )
                );
    }

    private FeedbackResponse toFeedbackResponse(
            Feedback feedback) {

        FeedbackResponse response = new FeedbackResponse();

        response.setId(feedback.getId());
        response.setRequestId(
                feedback.getRequest().getId()
        );
        response.setUserId(
                feedback.getUser().getId()
        );
        response.setUserName(
                feedback.getUser().getFullName()
        );
        response.setRating(feedback.getRating());
        response.setComment(feedback.getComment());
        response.setCreatedAt(feedback.getCreatedAt());

        return response;
    }
}