package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.CategoryDTO;
import com.web2.trabalhoFinal.service.CategoryService;
import com.web2.trabalhoFinal.service.PermissaoFuncionario;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryController {

    private final CategoryService categoryService;
    private final PermissaoFuncionario permissaoFuncionario;

    public CategoryController(
            CategoryService categoryService,
            PermissaoFuncionario permissaoFuncionario
    ) {
        this.categoryService = categoryService;
        this.permissaoFuncionario = permissaoFuncionario;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> listarTodas() {
        ApiResponse<List<CategoryDTO>> resposta = categoryService.listarTodasAtivas();
        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> buscarPorId(@PathVariable Long id) {
        ApiResponse<CategoryDTO> resposta = categoryService.findById(id);

        if (!resposta.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resposta);
        }

        return ResponseEntity.ok(resposta);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDTO>> salvar(@RequestBody CategoryDTO dto,
                                                           @SessionAttribute(name = "employeeId", required = false) Long employeeId
    ) {

        permissaoFuncionario.verificar(employeeId);
        ApiResponse<CategoryDTO> resposta = categoryService.save(dto);

        if (!resposta.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resposta);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> atualizar(@PathVariable Long id,
                                                              @RequestBody CategoryDTO dto,
                                                              @SessionAttribute(name = "employeeId", required = false) Long employeeId) {
        permissaoFuncionario.verificar(employeeId);
        ApiResponse<CategoryDTO> resposta = categoryService.update(id, dto);

        if (!resposta.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resposta);
        }

        return ResponseEntity.ok(resposta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> desativar(@PathVariable Long id, @SessionAttribute(name = "employeeId", required = false) Long employeeId) {
        permissaoFuncionario.verificar(employeeId);
        ApiResponse<Void> resposta = categoryService.desativar(id);

        if (!resposta.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resposta);
        }

        return ResponseEntity.ok(resposta);
    }
}