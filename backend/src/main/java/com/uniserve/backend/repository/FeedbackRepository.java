package com.uniserve.backend.repository;

import com.uniserve.backend.entity.Feedback;
import com.uniserve.backend.entity.ServiceRequest;
import com.uniserve.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    Optional<Feedback> findByRequestAndUser(
            ServiceRequest request,
            User user
    );

    boolean existsByRequestAndUser(
            ServiceRequest request,
            User user
    );
}