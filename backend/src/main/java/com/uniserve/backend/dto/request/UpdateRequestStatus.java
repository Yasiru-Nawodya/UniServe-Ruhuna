package com.uniserve.backend.dto.request;

import com.uniserve.backend.entity.RequestStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateRequestStatus {

    @NotNull
    private RequestStatus status;

    @Size(max = 500)
    private String comment;

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}