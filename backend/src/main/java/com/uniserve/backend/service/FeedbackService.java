package com.uniserve.backend.service;

import com.uniserve.backend.entity.Feedback;
import com.uniserve.backend.entity.ServiceRequest;
import com.uniserve.backend.entity.User;
import com.uniserve.backend.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public Optional<Feedback> getFeedback(
            ServiceRequest request,
            User user) {
        return feedbackRepository.findByRequestAndUser(request, user);
    }

    public boolean feedbackExists(
            ServiceRequest request,
            User user) {
        return feedbackRepository.existsByRequestAndUser(request, user);
    }

    public Feedback saveFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }
}