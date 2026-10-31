package com.uniserve.backend.controller;


import org.springframework.security.access.prepost.PreAuthorize;
import com.uniserve.backend.dto.request.CreateRequest;
import com.uniserve.backend.dto.request.RequestHistoryResponse;
import com.uniserve.backend.dto.request.RequestResponse;
import com.uniserve.backend.dto.request.UpdateRequestStatus;
import com.uniserve.backend.entity.RequestStatusHistory;
import com.uniserve.backend.entity.ServiceCategory;
import com.uniserve.backend.entity.ServiceRequest;
import com.uniserve.backend.entity.User;
import com.uniserve.backend.repository.UserRepository;
import com.uniserve.backend.service.RequestStatusHistoryService;
import com.uniserve.backend.service.ServiceCategoryService;
import com.uniserve.backend.service.ServiceRequestService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final ServiceRequestService serviceRequestService;
    private final ServiceCategoryService serviceCategoryService;
    private final RequestStatusHistoryService historyService;
    private final UserRepository userRepository;

    public RequestController(
            ServiceRequestService serviceRequestService,
            ServiceCategoryService serviceCategoryService,
            RequestStatusHistoryService historyService,
            UserRepository userRepository) {

        this.serviceRequestService = serviceRequestService;
        this.serviceCategoryService = serviceCategoryService;
        this.historyService = historyService;
        this.userRepository = userRepository;
    }

    // =========================================================
    // CREATE REQUEST
    // POST /api/requests
    // =========================================================

   @PostMapping
   @PreAuthorize("hasAnyRole('STUDENT', 'LECTURER')")
   public ResponseEntity<RequestResponse> createRequest(
            @Valid @RequestBody CreateRequest requestDto,
            Authentication authentication) {

        User currentUser = getAuthenticatedUser(authentication);

        ServiceCategory category =
                serviceCategoryService
                        .getCategoryById(requestDto.getCategoryId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Service category not found."
                                ));

        ServiceRequest request = new ServiceRequest();

        request.setTitle(requestDto.getTitle());
        request.setDescription(requestDto.getDescription());
        request.setLocation(requestDto.getLocation());
        request.setPriority(requestDto.getPriority());

        ServiceRequest savedRequest =
                serviceRequestService.createRequest(
                        request,
                        currentUser,
                        category
                );

        return ResponseEntity
                .status(201)
                .body(toResponse(savedRequest));
    }

    // =========================================================
    // GET MY REQUESTS
    // GET /api/requests/my
    // =========================================================

    @GetMapping("/my")
   @PreAuthorize("hasAnyRole('STUDENT', 'LECTURER')")
   public ResponseEntity<List<RequestResponse>> getMyRequests( 
            Authentication authentication) {

        User currentUser = getAuthenticatedUser(authentication);

        List<RequestResponse> requests =
                serviceRequestService
                        .getRequestsByUser(currentUser)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(requests);
    }

    // =========================================================
    // GET REQUEST BY ID
    // GET /api/requests/{id}
    // =========================================================

    @GetMapping("/{id}")
   @PreAuthorize("hasAnyRole('STUDENT', 'LECTURER')")
   public ResponseEntity<RequestResponse> getRequestById(
            @PathVariable Long id,
            Authentication authentication) {

        User currentUser = getAuthenticatedUser(authentication);

        return serviceRequestService
                .getRequestById(id)
                .filter(request ->
                        request.getSubmittedBy()
                                .getId()
                                .equals(currentUser.getId()))
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    // =========================================================
    // GET REQUEST HISTORY
    // GET /api/requests/{id}/history
    // =========================================================

    @GetMapping("/{id}/history")
   @PreAuthorize("hasAnyRole('STUDENT', 'LECTURER')")
   public ResponseEntity<List<RequestHistoryResponse>> getRequestHistory(
            @PathVariable Long id,
            Authentication authentication) {

        User currentUser = getAuthenticatedUser(authentication);

        return serviceRequestService
                .getRequestById(id)
                .filter(request ->
                        request.getSubmittedBy()
                                .getId()
                                .equals(currentUser.getId()))
                .map(request -> {

                    List<RequestHistoryResponse> history =
                            historyService
                                    .getHistoryForRequest(request)
                                    .stream()
                                    .map(this::toHistoryResponse)
                                    .toList();

                    return ResponseEntity.ok(history);
                })
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    // =========================================================
    // UPDATE REQUEST STATUS
    // PATCH /api/requests/{id}/status
    // =========================================================

    

    // =========================================================
    // GET AUTHENTICATED USER
    // =========================================================

    private User getAuthenticatedUser(
            Authentication authentication) {

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user not found."
                        ));
    }

    // =========================================================
    // REQUEST → RESPONSE DTO
    // =========================================================

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
        response.setLocation(
                request.getLocation()
        );
        response.setPriority(
                request.getPriority()
        );
        response.setStatus(
                request.getStatus()
        );

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

        response.setCreatedAt(
                request.getCreatedAt()
        );
        response.setUpdatedAt(
                request.getUpdatedAt()
        );
        response.setResolvedAt(
                request.getResolvedAt()
        );
        response.setClosedAt(
                request.getClosedAt()
        );

        return response;
    }

    // =========================================================
    // HISTORY → RESPONSE DTO
    // =========================================================

    private RequestHistoryResponse toHistoryResponse(
            RequestStatusHistory history) {

        RequestHistoryResponse response =
                new RequestHistoryResponse();

        response.setStatus(
                history.getStatus()
        );

        if (history.getChangedBy() != null) {

            response.setChangedById(
                    history.getChangedBy().getId()
            );

            response.setChangedByName(
                    history.getChangedBy().getFullName()
            );
        }

        response.setComment(
                history.getComment()
        );

        response.setCreatedAt(
                history.getCreatedAt()
        );

        return response;
    }
}