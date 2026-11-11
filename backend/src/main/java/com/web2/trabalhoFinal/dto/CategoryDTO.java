package com.web2.trabalhoFinal.dto;

import com.web2.trabalhoFinal.entities.Category;

public record CategoryDTO(
        Long id,
        String name,
        boolean active
)  {
    public CategoryDTO(Category category) {
        this(category.getId(), category.getName(), category.isActive());
    }
}