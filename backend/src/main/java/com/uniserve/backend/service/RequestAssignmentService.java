
package com.uniserve.backend.service;

import com.uniserve.backend.entity.Department;
import com.uniserve.backend.entity.RequestAssignment;
import com.uniserve.backend.entity.ServiceRequest;
import com.uniserve.backend.entity.User;
import com.uniserve.backend.repository.RequestAssignmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RequestAssignmentService {

    private final RequestAssignmentRepository assignmentRepository;

    public RequestAssignmentService(
            RequestAssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    // Get all assignments for a request
    public List<RequestAssignment> getAssignmentsForRequest(
            ServiceRequest request) {

        return assignmentRepository
                .findByRequestOrderByAssignedAtAsc(request);
    }

    // Get the latest assignment for a request
    public Optional<RequestAssignment> getLatestAssignment(
            ServiceRequest request) {

        return assignmentRepository
                .findFirstByRequestOrderByAssignedAtDesc(request);
    }

    // Create a new assignment
    @Transactional
    public RequestAssignment assignRequest(
            ServiceRequest request,
            Department department,
            User assignedBy,
            User assignedTo) {

        RequestAssignment assignment =
                new RequestAssignment();

        assignment.setRequest(request);
        assignment.setDepartment(department);
        assignment.setAssignedBy(assignedBy);
        assignment.setAssignedTo(assignedTo);

        return assignmentRepository.save(assignment);
    }

    // Unassign the latest active assignment
    @Transactional
    public RequestAssignment unassignLatestAssignment(
            ServiceRequest request) {

        RequestAssignment assignment =
                assignmentRepository
                        .findFirstByRequestOrderByAssignedAtDesc(request)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "No assignment found for this request."
                                ));

        if (assignment.getUnassignedAt() != null) {
            throw new IllegalStateException(
                    "The latest assignment is already unassigned."
            );
        }

        assignment.setUnassignedAt(
                LocalDateTime.now()
        );

        return assignmentRepository.save(assignment);
    }

    // Save an assignment directly
    public RequestAssignment saveAssignment(
            RequestAssignment assignment) {

        return assignmentRepository.save(assignment);
    }
}
