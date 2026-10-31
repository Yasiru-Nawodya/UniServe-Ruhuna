package com.uniserve.backend.controller;

import com.uniserve.backend.dto.department.DepartmentResponse;
import com.uniserve.backend.entity.Department;
import com.uniserve.backend.service.DepartmentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(
            DepartmentService departmentService) {

        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {

        List<DepartmentResponse> departments =
                departmentService.getAllDepartments()
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(departments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentResponse> getDepartmentById(
            @PathVariable Long id) {

        return departmentService.getDepartmentById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    private DepartmentResponse toResponse(Department department) {

        DepartmentResponse response = new DepartmentResponse();

        response.setId(department.getId());
        response.setName(department.getName());
        response.setDescription(department.getDescription());
        response.setActive(department.isActive());

        return response;
    }
}