package com.web2.trabalhoFinal.repository;

import com.web2.trabalhoFinal.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByActiveTrue();

    boolean existsByName(String name);
    Optional<Category> findByName(String name);
}
