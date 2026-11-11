package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.CreateEmployeeDTO;
import com.web2.trabalhoFinal.dto.EmployeeDTO;
import com.web2.trabalhoFinal.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
