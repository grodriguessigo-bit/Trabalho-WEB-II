package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.Category;
import com.web2.trabalhoFinal.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public ApiResponse<Category> salvar(Category category) {
        Category salvo = categoryRepository.save(category);
        return new ApiResponse<>(salvo, "Categoria salva com sucesso", true);
    }
}