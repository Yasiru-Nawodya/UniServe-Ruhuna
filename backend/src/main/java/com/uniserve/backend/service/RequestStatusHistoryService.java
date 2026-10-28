package com.uniserve.backend.service;

import com.uniserve.backend.entity.RequestStatusHistory;
import com.uniserve.backend.entity.ServiceRequest;
import com.uniserve.backend.repository.RequestStatusHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestStatusHistoryService {

    private final RequestStatusHistoryRepository historyRepository;

    public RequestStatusHistoryService(
            RequestStatusHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    public List<RequestStatusHistory> getHistoryForRequest(
            ServiceRequest request) {
        return historyRepository.findByRequestOrderByCreatedAtAsc(request);
    }

    public List<RequestStatusHistory> getHistoryByStatus(
            ServiceRequest request,
            com.uniserve.backend.entity.RequestStatus status) {
        return historyRepository.findByRequestAndStatus(request, status);
    }

    public RequestStatusHistory saveHistory(RequestStatusHistory history) {
        return historyRepository.save(history);
    }
}