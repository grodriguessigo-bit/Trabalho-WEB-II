package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.CategoryDTO;
import com.web2.trabalhoFinal.entities.Category;
import com.web2.trabalhoFinal.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional (readOnly = true)
    public ApiResponse<List<CategoryDTO>> listarTodasAtivas() {
        List<Category> categorias = categoryRepository.findByActiveTrue();
        List<CategoryDTO> dtos = new ArrayList<>();

        for (Category c : categorias) {
            dtos.add(new CategoryDTO(c));
        }

        return new ApiResponse<>(dtos, "Categorias listadas com sucesso", true);
    }

    @Transactional(readOnly = true)
    public ApiResponse<CategoryDTO> findById(Long id) {
        Optional<Category> optCategory = categoryRepository.findById(id);

        if (optCategory.isEmpty()) {
            return new ApiResponse<>(null, "Categoria não encontrada", false);
        }

        Category category = optCategory.get();
        return new ApiResponse<>(new CategoryDTO(category), "Categoria encontrada", true);
    }

    @Transactional
    public ApiResponse<CategoryDTO> save(CategoryDTO dto) {
        if (dto.name() == null || dto.name().trim().isEmpty()) {
            return new ApiResponse<>(null, "O nome da categoria é obrigatório", false);
        }

        if (categoryRepository.existsByName(dto.name())) {
            return new ApiResponse<>(null, "Categoria já existente", false);
        }

        Category category = new Category();
        category.setName(dto.name());
        category.setActive(true);

        Category salva = categoryRepository.save(category);

        return new ApiResponse<>(new CategoryDTO(salva), "Categoria criada com sucesso", true);
    }

    @Transactional
    public ApiResponse<CategoryDTO> update(Long id, CategoryDTO dto) {
        Optional<Category> optCategory = categoryRepository.findById(id);

        if (optCategory.isEmpty()) {
            return new ApiResponse<>(null, "Categoria não encontrada", false);
        }

        if (dto.name() == null || dto.name().trim().isEmpty()) {
            return new ApiResponse<>(null, "O nome da categoria não pode ser vazio", false);
        }

        String name = dto.name().trim();

        if (categoryRepository.existsByNameAndIdNot(name, id)) {
            return new ApiResponse<>(
                    "Já existe outra categoria com esse nome.",
                    false
            );
        }

        Category category = optCategory.get();
        category.setName(name);

        Category atualizada = categoryRepository.save(category);

        return new ApiResponse<>(new CategoryDTO(atualizada), "Categoria atualizada com sucesso", true);
    }

    @Transactional
    public ApiResponse<Void> desativar(Long id) {
        Optional<Category> optCategory = categoryRepository.findById(id);

        if (optCategory.isEmpty()) {
            return new ApiResponse<>(null, "Categoria não encontrada", false);
        }

        Category category = optCategory.get();
        category.setActive(false);
        categoryRepository.save(category);

        return new ApiResponse<>(null, "Categoria desativada com sucesso", true);
    }
}