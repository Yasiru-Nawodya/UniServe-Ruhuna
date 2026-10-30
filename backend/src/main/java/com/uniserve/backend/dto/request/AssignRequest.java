package com.uniserve.backend.dto.request;

import jakarta.validation.constraints.NotNull;

public class AssignRequest {

    @NotNull
    private Long departmentId;

    private Long assignedToId;

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Long getAssignedToId() {
        return assignedToId;
    }

    public void setAssignedToId(Long assignedToId) {
        this.assignedToId = assignedToId;
    }
}