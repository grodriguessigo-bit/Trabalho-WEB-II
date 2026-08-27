package com.web2.trabalhoFinal.dto;

import com.web2.trabalhoFinal.model.Category;

public record CategoryResponse(Long id, String nome, boolean ativo) {

    public static CategoryResponse from(Category category) {
        return new CategoryResponse(category.getId(), category.getNome(), category.isAtivo());
    }
}
