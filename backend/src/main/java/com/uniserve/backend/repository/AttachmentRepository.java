package com.uniserve.backend.repository;

import com.uniserve.backend.entity.Attachment;
import com.uniserve.backend.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    List<Attachment> findByRequestOrderByCreatedAtAsc(ServiceRequest request);
}