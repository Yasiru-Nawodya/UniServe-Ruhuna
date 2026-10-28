package com.uniserve.backend.repository;

import com.uniserve.backend.entity.RequestStatus;
import com.uniserve.backend.entity.RequestStatusHistory;
import com.uniserve.backend.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestStatusHistoryRepository
        extends JpaRepository<RequestStatusHistory, Long> {

    List<RequestStatusHistory> findByRequestOrderByCreatedAtAsc(ServiceRequest request);

    List<RequestStatusHistory> findByRequestAndStatus(
            ServiceRequest request,
            RequestStatus status
    );
}