package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.entities.Category;
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

        assertEquals("Notebook", category.getName());
        assertTrue(category.isActive());
    }

    @Test
    void createRejectsDuplicateName() {
        Category category = new Category();
        category.setName("Notebook");
        storedCategories.put(1L, category);

        assertThrows(CategoryService.CategoryAlreadyExistsException.class,
                () -> categoryService.create("Notebook"));
    }

    @Test
    void deactivateKeepsCategoryAndMarksItInactive() {
        Category category = new Category();
        category.setName("Notebook");
        storedCategories.put(1L, category);

        categoryService.deactivate(1L);

        assertFalse(category.isActive());
        assertEquals(category, storedCategories.get(1L));
    }

    private CategoryRepository inMemoryRepository() {
        return (CategoryRepository) Proxy.newProxyInstance(
                CategoryRepository.class.getClassLoader(),
                new Class<?>[]{CategoryRepository.class},
                (proxy, method, args) -> switch (method.getName()) {
                    case "existsByNameIgnoreCase" -> storedCategories.values().stream()
                            .anyMatch(category -> category.getName().equalsIgnoreCase((String) args[0]));
                    case "existsByNameIgnoreCaseAndIdNot" -> storedCategories.entrySet().stream()
                            .anyMatch(entry -> !entry.getKey().equals(args[1])
                                    && entry.getValue().getName().equalsIgnoreCase((String) args[0]));
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
