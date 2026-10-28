
package com.uniserve.backend.service;

import com.uniserve.backend.entity.Department;
import com.uniserve.backend.entity.ServiceCategory;
import com.uniserve.backend.repository.ServiceCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ServiceCategoryService {

    private final ServiceCategoryRepository serviceCategoryRepository;

    public ServiceCategoryService(
            ServiceCategoryRepository serviceCategoryRepository) {

        this.serviceCategoryRepository =
                serviceCategoryRepository;
    }

    // Get all categories
    public List<ServiceCategory> getAllCategories() {
        return serviceCategoryRepository.findAll();
    }

    // Get category by ID
    public Optional<ServiceCategory> getCategoryById(Long id) {
        return serviceCategoryRepository.findById(id);
    }

    // Get category by name
    public Optional<ServiceCategory> getCategoryByName(
            String name) {

        return serviceCategoryRepository.findByName(name);
    }

    // Check whether category exists
    public boolean categoryExists(String name) {
        return serviceCategoryRepository.existsByName(name);
    }

    // Get departments associated with a category
    public Set<Department> getDepartmentsForCategory(
            ServiceCategory category) {

        return category.getDepartments();
    }
}
