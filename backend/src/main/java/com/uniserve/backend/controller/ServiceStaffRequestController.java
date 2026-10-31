package com.uniserve.backend.controller;

import com.uniserve.backend.dto.request.RequestHistoryResponse;
import com.uniserve.backend.dto.request.RequestResponse;
import com.uniserve.backend.dto.request.UpdateRequestStatus;
import com.uniserve.backend.entity.RequestAssignment;
import com.uniserve.backend.entity.RequestStatus;
import com.uniserve.backend.entity.ServiceRequest;
import com.uniserve.backend.entity.User;
import com.uniserve.backend.repository.RequestAssignmentRepository;
import com.uniserve.backend.repository.UserRepository;
import com.uniserve.backend.service.RequestStatusHistoryService;
import com.uniserve.backend.service.ServiceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/requests")
@PreAuthorize("hasRole('SERVICE_STAFF')")
public class ServiceStaffRequestController {

    private final ServiceRequestService serviceRequestService;
    private final RequestStatusHistoryService historyService;
    private final RequestAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    public ServiceStaffRequestController(
            ServiceRequestService serviceRequestService,
            RequestStatusHistoryService historyService,
            RequestAssignmentRepository assignmentRepository,
            UserRepository userRepository) {

        this.serviceRequestService = serviceRequestService;
        this.historyService = historyService;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<RequestResponse>> getAssignedRequests(
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        List<RequestAssignment> assignments =
                assignmentRepository
                        .findByAssignedToIdAndUnassignedAtIsNull(
                                currentUser.getId()
                        );

        List<RequestResponse> requests = assignments.stream()
                .map(RequestAssignment::getRequest)
                .filter(request ->
                        request.getStatus() == RequestStatus.ASSIGNED
                                || request.getStatus() == RequestStatus.IN_PROGRESS
                )
                .map(this::toRequestResponse)
                .toList();

        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse> getRequest(
            @PathVariable Long id,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        ServiceRequest request = getAssignedRequest(id, currentUser);

        return ResponseEntity.ok(toRequestResponse(request));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<RequestHistoryResponse>> getRequestHistory(
            @PathVariable Long id,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        ServiceRequest request = getAssignedRequest(id, currentUser);

        List<RequestHistoryResponse> response =
                historyService.getHistoryForRequest(request)
                        .stream()
                        .map(history -> {
                            RequestHistoryResponse item =
                                    new RequestHistoryResponse();

                            item.setStatus(history.getStatus());
                            item.setChangedById(
                                    history.getChangedBy().getId()
                            );
                            item.setChangedByName(
                                    history.getChangedBy().getFullName()
                            );
                            item.setComment(history.getComment());
                            item.setCreatedAt(history.getCreatedAt());

                            return item;
                        })
                        .toList();

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<RequestResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRequestStatus statusRequest,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        ServiceRequest request = getAssignedRequest(id, currentUser);

        RequestStatus newStatus = statusRequest.getStatus();

        if (newStatus != RequestStatus.IN_PROGRESS
                && newStatus != RequestStatus.RESOLVED) {

            throw new IllegalStateException(
                    "Service staff can only change status to IN_PROGRESS or RESOLVED."
            );
        }

        ServiceRequest updatedRequest =
                serviceRequestService.updateStatus(
                        request.getId(),
                        newStatus,
                        currentUser,
                        statusRequest.getComment()
                );

        return ResponseEntity.ok(toRequestResponse(updatedRequest));
    }

    private ServiceRequest getAssignedRequest(
            Long requestId,
            User currentUser) {

        ServiceRequest request =
                serviceRequestService.getRequestById(requestId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Service request not found."
                                )
                        );

        RequestAssignment assignment =
                assignmentRepository
                        .findFirstByRequestOrderByAssignedAtDesc(request)
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "This request has no assignment."
                                )
                        );

        if (assignment.getUnassignedAt() != null) {
            throw new IllegalStateException(
                    "This request is no longer actively assigned."
            );
        }

        if (assignment.getAssignedTo() == null
                || !assignment.getAssignedTo()
                        .getId()
                        .equals(currentUser.getId())) {

            throw new IllegalStateException(
                    "You are not assigned to this request."
            );
        }

        return request;
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

    private RequestResponse toRequestResponse(
            ServiceRequest request) {

        RequestResponse response = new RequestResponse();

        response.setId(request.getId());
        response.setRequestNumber(request.getRequestNumber());
        response.setTitle(request.getTitle());
        response.setDescription(request.getDescription());
        response.setLocation(request.getLocation());
        response.setPriority(request.getPriority());
        response.setStatus(request.getStatus());

        response.setCategoryId(
                request.getCategory() != null
                        ? request.getCategory().getId()
                        : null
        );

        response.setCategoryName(
                request.getCategory() != null
                        ? request.getCategory().getName()
                        : null
        );

        response.setSubmittedById(
                request.getSubmittedBy() != null
                        ? request.getSubmittedBy().getId()
                        : null
        );

        response.setSubmittedByName(
                request.getSubmittedBy() != null
                        ? request.getSubmittedBy().getFullName()
                        : null
        );

        response.setAssignedDepartmentId(
                request.getAssignedDepartment() != null
                        ? request.getAssignedDepartment().getId()
                        : null
        );

        response.setAssignedDepartmentName(
                request.getAssignedDepartment() != null
                        ? request.getAssignedDepartment().getName()
                        : null
        );

        response.setCreatedAt(request.getCreatedAt());
        response.setUpdatedAt(request.getUpdatedAt());
        response.setResolvedAt(request.getResolvedAt());
        response.setClosedAt(request.getClosedAt());

        return response;
    }
}