package com.uniserve.backend.repository;

import com.uniserve.backend.entity.RequestStatus;
import com.uniserve.backend.entity.ServiceRequest;
import com.uniserve.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    Optional<ServiceRequest> findByRequestNumber(String requestNumber);

    boolean existsByRequestNumber(String requestNumber);

    List<ServiceRequest> findBySubmittedBy(User user);

    List<ServiceRequest> findByStatus(RequestStatus status);

    List<ServiceRequest> findBySubmittedByAndStatus(User user, RequestStatus status);
}