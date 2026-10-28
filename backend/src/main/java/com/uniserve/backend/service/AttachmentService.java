package com.uniserve.backend.service;

import com.uniserve.backend.entity.Attachment;
import com.uniserve.backend.entity.ServiceRequest;
import com.uniserve.backend.repository.AttachmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;

    public AttachmentService(AttachmentRepository attachmentRepository) {
        this.attachmentRepository = attachmentRepository;
    }

    public List<Attachment> getAttachmentsForRequest(
            ServiceRequest request) {
        return attachmentRepository.findByRequestOrderByCreatedAtAsc(request);
    }

    public Attachment saveAttachment(Attachment attachment) {
        return attachmentRepository.save(attachment);
    }

    public void deleteAttachment(Long id) {
        attachmentRepository.deleteById(id);
    }
}