package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.model.Category;
import com.web2.trabalhoFinal.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private static final int MAX_NAME_LENGTH = 100;

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<Category> list() {
        return categoryRepository.findAllByOrderByNomeAsc();
    }

    @Transactional(readOnly = true)
    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));
    }

    @Transactional
    public Category create(String nome) {
        String normalizedName = normalizeName(nome);
        ensureNameIsAvailable(normalizedName, null);

        Category category = new Category(normalizedName);
        return categoryRepository.save(category);
    }

    @Transactional
    public Category update(Long id, String nome) {
        String normalizedName = normalizeName(nome);
        Category category = findById(id);
        ensureNameIsAvailable(normalizedName, id);

        category.setNome(normalizedName);
        return categoryRepository.save(category);
    }

    @Transactional
    public void deactivate(Long id) {
        Category category = findById(id);
        category.setAtivo(false);
        categoryRepository.save(category);
    }

    @Transactional
    public Category activate(Long id) {
        Category category = findById(id);
        ensureNameIsAvailable(category.getNome(), id);

        category.setAtivo(true);
        return categoryRepository.save(category);
    }

    private void ensureNameIsAvailable(String nome, Long ignoredId) {
        boolean alreadyExists = ignoredId == null
                ? categoryRepository.existsByNomeIgnoreCase(nome)
                : categoryRepository.existsByNomeIgnoreCaseAndIdNot(nome, ignoredId);

        if (alreadyExists) {
            throw new CategoryAlreadyExistsException(nome);
        }
    }

    private String normalizeName(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("O nome da categoria é obrigatório.");
        }

        String normalizedName = nome.trim();
        if (normalizedName.length() > MAX_NAME_LENGTH) {
            throw new IllegalArgumentException("O nome da categoria deve ter no máximo 100 caracteres.");
        }

        return normalizedName;
    }

    public static class CategoryNotFoundException extends RuntimeException {
        public CategoryNotFoundException(Long id) {
            super("Categoria não encontrada: " + id);
        }
    }

    public static class CategoryAlreadyExistsException extends RuntimeException {
        public CategoryAlreadyExistsException(String nome) {
            super("Já existe uma categoria com o nome: " + nome);
        }
    }
}
