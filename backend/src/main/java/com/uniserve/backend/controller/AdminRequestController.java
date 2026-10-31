package com.uniserve.backend.controller;

import com.uniserve.backend.dto.request.AssignRequest;
import com.uniserve.backend.dto.request.RequestHistoryResponse;
import com.uniserve.backend.dto.request.RequestResponse;
import com.uniserve.backend.dto.request.UpdateRequestStatus;
import com.uniserve.backend.entity.Department;
import com.uniserve.backend.entity.RequestStatus;
import com.uniserve.backend.entity.RequestStatusHistory;
import com.uniserve.backend.entity.ServiceRequest;
import com.uniserve.backend.entity.User;
import com.uniserve.backend.repository.DepartmentRepository;
import com.uniserve.backend.repository.RequestStatusHistoryRepository;
import com.uniserve.backend.repository.UserRepository;
import com.uniserve.backend.service.RequestAssignmentService;
import com.uniserve.backend.service.RequestStatusHistoryService;
import com.uniserve.backend.service.ServiceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/requests")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRequestController {

    private final ServiceRequestService serviceRequestService;
    private final RequestStatusHistoryService historyService;
    private final RequestAssignmentService assignmentService;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public AdminRequestController(
            ServiceRequestService serviceRequestService,
            RequestStatusHistoryService historyService,
            RequestAssignmentService assignmentService,
            DepartmentRepository departmentRepository,
            UserRepository userRepository) {

        this.serviceRequestService = serviceRequestService;
        this.historyService = historyService;
        this.assignmentService = assignmentService;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<RequestResponse>> getPendingRequests() {

        List<RequestResponse> requests =
                serviceRequestService
                        .getRequestsByStatus(RequestStatus.PENDING)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse> getRequest(
            @PathVariable Long id) {

        return serviceRequestService
                .getRequestById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<RequestHistoryResponse>> getRequestHistory(
            @PathVariable Long id) {

        ServiceRequest request =
                serviceRequestService
                        .getRequestById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Service request not found."
                                ));

        List<RequestHistoryResponse> history =
                historyService
                        .getHistoryForRequest(request)
                        .stream()
                        .map(this::toHistoryResponse)
                        .toList();

        return ResponseEntity.ok(history);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<RequestResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRequestStatus statusDto,
            Authentication authentication) {

        User currentUser = getAuthenticatedUser(authentication);

        ServiceRequest updatedRequest =
                serviceRequestService.updateStatus(
                        id,
                        statusDto.getStatus(),
                        currentUser,
                        statusDto.getComment()
                );

        return ResponseEntity.ok(
                toResponse(updatedRequest)
        );
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<RequestResponse> assignRequest(
            @PathVariable Long id,
            @Valid @RequestBody AssignRequest assignDto,
            Authentication authentication) {

        User currentUser = getAuthenticatedUser(authentication);

        ServiceRequest request =
                serviceRequestService
                        .getRequestById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Service request not found."
                                ));

        Department department =
                departmentRepository
                        .findById(assignDto.getDepartmentId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Department not found."
                                ));

        User assignedTo = null;

        if (assignDto.getAssignedToId() != null) {
            assignedTo =
                    userRepository
                            .findById(assignDto.getAssignedToId())
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Assigned staff member not found."
                                    ));
        }

       assignmentService.assignRequest(
        request,
        department,
        currentUser,
        assignedTo
);

        ServiceRequest updatedRequest =
                serviceRequestService.updateStatus(
                        id,
                        RequestStatus.ASSIGNED,
                        currentUser,
                        "Request assigned by admin."
                );

        return ResponseEntity.ok(
                toResponse(updatedRequest)
        );
    }

    private User getAuthenticatedUser(
            Authentication authentication) {

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user not found."
                        ));
    }

    private RequestResponse toResponse(
            ServiceRequest request) {

        RequestResponse response =
                new RequestResponse();

        response.setId(request.getId());
        response.setRequestNumber(
                request.getRequestNumber()
        );
        response.setTitle(request.getTitle());
        response.setDescription(
                request.getDescription()
        );
        response.setLocation(request.getLocation());
        response.setPriority(request.getPriority());
        response.setStatus(request.getStatus());

        if (request.getCategory() != null) {
            response.setCategoryId(
                    request.getCategory().getId()
            );
            response.setCategoryName(
                    request.getCategory().getName()
            );
        }

        if (request.getSubmittedBy() != null) {
            response.setSubmittedById(
                    request.getSubmittedBy().getId()
            );
            response.setSubmittedByName(
                    request.getSubmittedBy().getFullName()
            );
        }

        if (request.getAssignedDepartment() != null) {
            response.setAssignedDepartmentId(
                    request.getAssignedDepartment().getId()
            );
            response.setAssignedDepartmentName(
                    request.getAssignedDepartment().getName()
            );
        }

        response.setCreatedAt(request.getCreatedAt());
        response.setUpdatedAt(request.getUpdatedAt());
        response.setResolvedAt(request.getResolvedAt());
        response.setClosedAt(request.getClosedAt());

        return response;
    }

    private RequestHistoryResponse toHistoryResponse(
            RequestStatusHistory history) {

        RequestHistoryResponse response =
                new RequestHistoryResponse();

        response.setStatus(history.getStatus());

        if (history.getChangedBy() != null) {
            response.setChangedById(
                    history.getChangedBy().getId()
            );
            response.setChangedByName(
                    history.getChangedBy().getFullName()
            );
        }

        response.setComment(history.getComment());
        response.setCreatedAt(history.getCreatedAt());

        return response;
    }
}