package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.CreateEmployeeDTO;
import com.web2.trabalhoFinal.dto.EmployeeDTO;
import com.web2.trabalhoFinal.dto.UpdateEmployeeDTO;
import com.web2.trabalhoFinal.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
@CrossOrigin(origins = "http://localhost:4200")
public class EmployeeController {

    private final EmployeeService employeeService;
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeDTO>>salvar(@RequestBody CreateEmployeeDTO dto) {
        ApiResponse<EmployeeDTO> resposta = employeeService.salvar(dto);

        HttpStatus status;
        if (resposta.isSuccess()) status = HttpStatus.CREATED;
        else if ("Email já cadastrado".equals(resposta.getMessage())) status = HttpStatus.CONFLICT;
        else status = HttpStatus.BAD_REQUEST;

        return ResponseEntity.status(status).body(resposta);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> listar() {
        return ResponseEntity.ok(employeeService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> buscarPorId(@PathVariable Long id) {
        ApiResponse<EmployeeDTO> resposta = employeeService.buscarPorId(id);
        HttpStatus status = resposta.isSuccess() ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return ResponseEntity.status(status).body(resposta);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> atualizar(@PathVariable Long id,
                                                              @RequestBody UpdateEmployeeDTO dto) {
        ApiResponse<EmployeeDTO> resposta = employeeService.atualizar(id, dto);

        HttpStatus status;
        if (resposta.isSuccess()) status = HttpStatus.OK;
        else if ("Funcionário não encontrado".equals(resposta.getMessage())) status = HttpStatus.NOT_FOUND;
        else if ("Email já cadastrado".equals(resposta.getMessage())) status = HttpStatus.CONFLICT;
        else status = HttpStatus.BAD_REQUEST;

        return ResponseEntity.status(status).body(resposta);
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<EmployeeDTO>> desativar(
            @PathVariable Long id,
            @SessionAttribute(value = "EmployeeId", required = false) Long idSolicitante) {

        if (idSolicitante == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new ApiResponse<>("Entre como funcionário.", false)
            );
        }

        ApiResponse<EmployeeDTO> resposta = employeeService.desativar(id, idSolicitante);

        HttpStatus status;
        if (resposta.isSuccess()) status = HttpStatus.OK;
        else if ("Funcionário não encontrado".equals(resposta.getMessage())) status = HttpStatus.NOT_FOUND;
        else status = HttpStatus.CONFLICT;

        return ResponseEntity.status(status).body(resposta);
    }
}
