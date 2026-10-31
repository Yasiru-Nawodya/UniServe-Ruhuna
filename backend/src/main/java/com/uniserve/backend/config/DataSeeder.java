package com.uniserve.backend.config;

import com.uniserve.backend.entity.Department;
import com.uniserve.backend.entity.ServiceCategory;
import com.uniserve.backend.repository.DepartmentRepository;
import com.uniserve.backend.repository.ServiceCategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Set;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            DepartmentRepository departmentRepository,
            ServiceCategoryRepository categoryRepository) {

        return args -> {

            // ==========================================
            // DEPARTMENTS
            // ==========================================

            Department itDepartment =
                    departmentRepository
                            .findByName("IT & Network")
                            .orElseGet(() -> {

                                Department department =
                                        new Department();

                                department.setName(
                                        "IT & Network"
                                );

                                department.setDescription(
                                        "Handles computer systems, network connectivity, software and IT-related services."
                                );

                                department.setActive(true);

                                return departmentRepository.save(
                                        department
                                );
                            });

            Department electricalDepartment =
                    departmentRepository
                            .findByName("Electrical")
                            .orElseGet(() -> {

                                Department department =
                                        new Department();

                                department.setName(
                                        "Electrical"
                                );

                                department.setDescription(
                                        "Handles electrical systems, power supply and electrical equipment."
                                );

                                department.setActive(true);

                                return departmentRepository.save(
                                        department
                                );
                            });

            Department buildingDepartment =
                    departmentRepository
                            .findByName("Building & Furniture")
                            .orElseGet(() -> {

                                Department department =
                                        new Department();

                                department.setName(
                                        "Building & Furniture"
                                );

                                department.setDescription(
                                        "Handles building maintenance, furniture and physical infrastructure."
                                );

                                department.setActive(true);

                                return departmentRepository.save(
                                        department
                                );
                            });

            Department cleaningDepartment =
                    departmentRepository
                            .findByName("Cleaning & Sanitation")
                            .orElseGet(() -> {

                                Department department =
                                        new Department();

                                department.setName(
                                        "Cleaning & Sanitation"
                                );

                                department.setDescription(
                                        "Handles cleaning, waste management and sanitation services."
                                );

                                department.setActive(true);

                                return departmentRepository.save(
                                        department
                                );
                            });

            Department plumbingDepartment =
                    departmentRepository
                            .findByName("Water & Plumbing")
                            .orElseGet(() -> {

                                Department department =
                                        new Department();

                                department.setName(
                                        "Water & Plumbing"
                                );

                                department.setDescription(
                                        "Handles water supply, plumbing and drainage issues."
                                );

                                department.setActive(true);

                                return departmentRepository.save(
                                        department
                                );
                            });

            Department laboratoryDepartment =
                    departmentRepository
                            .findByName("Laboratory Equipment")
                            .orElseGet(() -> {

                                Department department =
                                        new Department();

                                department.setName(
                                        "Laboratory Equipment"
                                );

                                department.setDescription(
                                        "Handles laboratory equipment and technical laboratory services."
                                );

                                department.setActive(true);

                                return departmentRepository.save(
                                        department
                                );
                            });

            // ==========================================
            // SERVICE CATEGORIES
            // ==========================================

            createCategory(
                    categoryRepository,
                    "IT & Network",
                    "Computer, network, internet and software-related issues.",
                    Set.of(itDepartment)
            );

            createCategory(
                    categoryRepository,
                    "Electrical",
                    "Electrical power, lighting and electrical equipment issues.",
                    Set.of(electricalDepartment)
            );

            createCategory(
                    categoryRepository,
                    "Classroom Equipment",
                    "Issues involving projectors, displays, microphones and classroom equipment.",
                    Set.of(itDepartment, electricalDepartment)
            );

            createCategory(
                    categoryRepository,
                    "Building & Furniture",
                    "Building maintenance, desks, chairs, doors and other furniture issues.",
                    Set.of(buildingDepartment)
            );

            createCategory(
                    categoryRepository,
                    "Cleaning & Sanitation",
                    "Cleaning, waste disposal and sanitation-related issues.",
                    Set.of(cleaningDepartment)
            );

            createCategory(
                    categoryRepository,
                    "Water & Plumbing",
                    "Water supply, taps, toilets, pipes and plumbing issues.",
                    Set.of(plumbingDepartment)
            );

            createCategory(
                    categoryRepository,
                    "Laboratory Equipment",
                    "Laboratory equipment and technical laboratory issues.",
                    Set.of(laboratoryDepartment)
            );

            createCategory(
                    categoryRepository,
                    "Other",
                    "Service issues that do not fit into the available categories.",
                    Set.of(buildingDepartment)
            );

            System.out.println("UniServe seed data initialized.");
        };
    }

    private void createCategory(
            ServiceCategoryRepository repository,
            String name,
            String description,
            Set<Department> departments) {

        ServiceCategory category =
                repository.findByName(name)
                        .orElseGet(() -> {

                            ServiceCategory newCategory =
                                    new ServiceCategory();

                            newCategory.setName(name);
                            newCategory.setDescription(description);
                            newCategory.setActive(true);

                            return newCategory;
                        });

        category.setDepartments(departments);

        repository.save(category);
    }
}