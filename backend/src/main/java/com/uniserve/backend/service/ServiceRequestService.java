
package com.uniserve.backend.service;

import com.uniserve.backend.entity.RequestStatus;
import com.uniserve.backend.entity.RequestStatusHistory;
import com.uniserve.backend.entity.ServiceCategory;
import com.uniserve.backend.entity.ServiceRequest;
import com.uniserve.backend.entity.User;
import com.uniserve.backend.repository.RequestStatusHistoryRepository;
import com.uniserve.backend.repository.ServiceRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.uniserve.backend.entity.Department;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final RequestStatusHistoryRepository historyRepository;

    public ServiceRequestService(
            ServiceRequestRepository serviceRequestRepository,
            RequestStatusHistoryRepository historyRepository) {

        this.serviceRequestRepository = serviceRequestRepository;
        this.historyRepository = historyRepository;
    }

    // Get all service requests
    public List<ServiceRequest> getAllRequests() {
        return serviceRequestRepository.findAll();
    }

    // Get a request by database ID
    public Optional<ServiceRequest> getRequestById(Long id) {
        return serviceRequestRepository.findById(id);
    }

    // Get a request by public request number
    public Optional<ServiceRequest> getRequestByNumber(
            String requestNumber) {

        return serviceRequestRepository
                .findByRequestNumber(requestNumber);
    }

    // Get all requests submitted by a specific user
    public List<ServiceRequest> getRequestsByUser(User user) {
        return serviceRequestRepository.findBySubmittedBy(user);
    }

    // Get all requests with a specific status
    public List<ServiceRequest> getRequestsByStatus(
            RequestStatus status) {

        return serviceRequestRepository.findByStatus(status);
    }

    // Get requests submitted by a user with a specific status
    public List<ServiceRequest> getRequestsByUserAndStatus(
            User user,
            RequestStatus status) {

        return serviceRequestRepository
                .findBySubmittedByAndStatus(user, status);
    }

    // Check whether a request number already exists
    public boolean requestNumberExists(String requestNumber) {

        return serviceRequestRepository
                .existsByRequestNumber(requestNumber);
    }

    // Create a new service request
    @Transactional
    public ServiceRequest createRequest(
            ServiceRequest request,
            User submittedBy,
            ServiceCategory category) {

     request.setSubmittedBy(submittedBy);
request.setCategory(category);

getSuggestedDepartment(category)
        .ifPresent(request::setAssignedDepartment);

request.setStatus(RequestStatus.PENDING);
        // Default priority
        if (request.getPriority() == null) {
            request.setPriority(
                    com.uniserve.backend.entity.Priority.MEDIUM
            );
        }

        // Generate request number
        request.setRequestNumber(generateRequestNumber());

        // Save the request
        ServiceRequest savedRequest =
                serviceRequestRepository.save(request);

        // Create the initial status history record
        createInitialStatusHistory(
                savedRequest,
                submittedBy
        );

        return savedRequest;
    }

    // Create initial status history entry
    private void createInitialStatusHistory(
            ServiceRequest request,
            User user) {

        RequestStatusHistory history =
                new RequestStatusHistory();

        history.setRequest(request);
        history.setStatus(RequestStatus.PENDING);
        history.setChangedBy(user);
        history.setComment("Service request created.");

        historyRepository.save(history);
    }

    // Generate request number such as USR-0001
    private String generateRequestNumber() {

        long nextId =
                serviceRequestRepository.count() + 1;

        String requestNumber =
                String.format("USR-%04d", nextId);

        // Make sure the generated number is unique
        while (serviceRequestRepository
                .existsByRequestNumber(requestNumber)) {

            nextId++;

            requestNumber =
                    String.format("USR-%04d", nextId);
        }

        return requestNumber;
    }

    // Check whether a status transition is allowed
    public boolean isValidStatusTransition(
            RequestStatus currentStatus,
            RequestStatus newStatus) {

        return switch (currentStatus) {

            case PENDING ->
                    newStatus == RequestStatus.REVIEWED;

            case REVIEWED ->
                    newStatus == RequestStatus.ASSIGNED
                            || newStatus == RequestStatus.PENDING;

            case ASSIGNED ->
                    newStatus == RequestStatus.IN_PROGRESS;

            case IN_PROGRESS ->
                    newStatus == RequestStatus.RESOLVED;

            case RESOLVED ->
                    newStatus == RequestStatus.CLOSED
                            || newStatus == RequestStatus.REOPENED;

            case CLOSED ->
                    newStatus == RequestStatus.REOPENED;

            case REOPENED ->
                    newStatus == RequestStatus.REVIEWED;
        };
    }

    // Update request status and record the change in history
    @Transactional
    public ServiceRequest updateStatus(
            Long requestId,
            RequestStatus newStatus,
            User changedBy,
            String comment) {

        ServiceRequest request =
                serviceRequestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Service request not found."
                                ));

        RequestStatus currentStatus =
                request.getStatus();

        // Prevent invalid status transitions
        if (!isValidStatusTransition(
                currentStatus,
                newStatus)) {

            throw new IllegalStateException(
                    "Invalid status transition from "
                            + currentStatus
                            + " to "
                            + newStatus
            );
        }

        // Update request status
        request.setStatus(newStatus);

        // Save updated request
        ServiceRequest updatedRequest =
                serviceRequestRepository.save(request);

        // Create status history record
        RequestStatusHistory history =
                new RequestStatusHistory();

        history.setRequest(updatedRequest);
        history.setStatus(newStatus);
        history.setChangedBy(changedBy);
        history.setComment(comment);

        historyRepository.save(history);

        return updatedRequest;
    }


public Optional<Department> getSuggestedDepartment(
        ServiceCategory category) {

    if (category == null ||
            category.getDepartments() == null ||
            category.getDepartments().isEmpty()) {

        return Optional.empty();
    }

    return category.getDepartments()
            .stream()
            .filter(Department::isActive)
            .findFirst();
}












}
