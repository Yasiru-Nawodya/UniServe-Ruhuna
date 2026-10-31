package com.uniserve.backend.controller;

import com.uniserve.backend.dto.category.CategoryResponse;
import com.uniserve.backend.entity.ServiceCategory;
import com.uniserve.backend.service.ServiceCategoryService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final ServiceCategoryService serviceCategoryService;

    public CategoryController(
            ServiceCategoryService serviceCategoryService) {

        this.serviceCategoryService = serviceCategoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {

        List<CategoryResponse> categories =
                serviceCategoryService.getAllCategories()
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(
            @PathVariable Long id) {

        return serviceCategoryService.getCategoryById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    private CategoryResponse toResponse(ServiceCategory category) {

        CategoryResponse response = new CategoryResponse();

        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setActive(category.isActive());

        return response;
    }
}