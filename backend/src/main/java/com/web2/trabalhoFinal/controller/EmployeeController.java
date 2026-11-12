package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.CreateEmployeeDTO;
import com.web2.trabalhoFinal.dto.EmployeeDTO;
import com.web2.trabalhoFinal.dto.UpdateEmployeeDTO;
import com.web2.trabalhoFinal.service.EmployeeService;
import com.web2.trabalhoFinal.service.EmployeePermission;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final EmployeePermission employeePermission;

    public EmployeeController(
            EmployeeService employeeService,
            EmployeePermission employeePermission
    ) {
        this.employeeService = employeeService;
        this.employeePermission = employeePermission;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeDTO>> salvar(
            @RequestBody CreateEmployeeDTO dto,
            @SessionAttribute(name = "employeeId", required = false) Long employeeId
    ) {
        employeePermission.verificar(employeeId);
        ApiResponse<EmployeeDTO> resposta = employeeService.salvar(dto);

        HttpStatus status;
        if (resposta.isSuccess()) status = HttpStatus.CREATED;
        else if ("Email já cadastrado".equals(resposta.getMessage())) status = HttpStatus.CONFLICT;
        else status = HttpStatus.BAD_REQUEST;

        return ResponseEntity.status(status).body(resposta);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> listar(
            @SessionAttribute(name = "employeeId", required = false) Long employeeId
    ) {
        employeePermission.verificar(employeeId);
        return ResponseEntity.ok(employeeService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> buscarPorId(
            @PathVariable Long id,
            @SessionAttribute(name = "employeeId", required = false) Long employeeId
    ) {
        employeePermission.verificar(employeeId);
        ApiResponse<EmployeeDTO> resposta = employeeService.buscarPorId(id);
        HttpStatus status = resposta.isSuccess() ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return ResponseEntity.status(status).body(resposta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> atualizar(@PathVariable Long id,
                                                              @RequestBody UpdateEmployeeDTO dto,
                                                              @SessionAttribute(name = "employeeId", required = false) Long employeeId)
    {
        employeePermission.verificar(employeeId);
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
            @SessionAttribute(value = "employeeId", required = false) Long idSolicitante) {
        employeePermission.verificar(idSolicitante);
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
