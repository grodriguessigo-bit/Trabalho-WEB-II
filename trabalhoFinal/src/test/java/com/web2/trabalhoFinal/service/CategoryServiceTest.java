package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.entities.model.Category;
import com.web2.trabalhoFinal.repository.CategoryRepository;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CategoryServiceTest {

    private final Map<Long, Category> storedCategories = new HashMap<>();
    private final CategoryRepository categoryRepository = inMemoryRepository();
    private final CategoryService categoryService = new CategoryService(categoryRepository);

    @Test
    void createTrimsNameAndStartsCategoryAsActive() {
        Category category = categoryService.create("  Notebook  ");

        assertEquals("Notebook", category.getNome());
        assertTrue(category.isAtivo());
    }

    @Test
    void createRejectsDuplicateName() {
        storedCategories.put(1L, new Category("Notebook"));

        assertThrows(CategoryService.CategoryAlreadyExistsException.class,
                () -> categoryService.create("Notebook"));
    }

    @Test
    void deactivateKeepsCategoryAndMarksItInactive() {
        Category category = new Category("Notebook");
        storedCategories.put(1L, category);

        categoryService.deactivate(1L);

        assertFalse(category.isAtivo());
        assertEquals(category, storedCategories.get(1L));
    }

    private CategoryRepository inMemoryRepository() {
        return (CategoryRepository) Proxy.newProxyInstance(
                CategoryRepository.class.getClassLoader(),
                new Class<?>[]{CategoryRepository.class},
                (proxy, method, args) -> switch (method.getName()) {
                    case "existsByNomeIgnoreCase" -> storedCategories.values().stream()
                            .anyMatch(category -> category.getNome().equalsIgnoreCase((String) args[0]));
                    case "existsByNomeIgnoreCaseAndIdNot" -> storedCategories.entrySet().stream()
                            .anyMatch(entry -> !entry.getKey().equals(args[1])
                                    && entry.getValue().getNome().equalsIgnoreCase((String) args[0]));
                    case "findById" -> Optional.ofNullable(storedCategories.get(args[0]));
                    case "save" -> {
                        Category category = (Category) args[0];
                        if (category.getId() != null) {
                            storedCategories.put(category.getId(), category);
                        }
                        yield category;
                    }
                    default -> throw new UnsupportedOperationException(method.getName());
                });
    }
}
