package com.uniserve.backend.repository;

import com.uniserve.backend.entity.RequestAssignment;
import com.uniserve.backend.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RequestAssignmentRepository
        extends JpaRepository<RequestAssignment, Long> {

    List<RequestAssignment> findByRequestOrderByAssignedAtAsc(ServiceRequest request);

    Optional<RequestAssignment> findFirstByRequestOrderByAssignedAtDesc(
            ServiceRequest request
    );
}