package com.uniserve.backend.dto.request;

import jakarta.validation.constraints.Size;

public class ReopenRequest {

    @Size(max = 500)
    private String comment;

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}