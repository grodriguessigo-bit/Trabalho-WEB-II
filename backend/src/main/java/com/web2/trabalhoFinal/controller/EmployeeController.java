package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.Employee;
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
    public ResponseEntity<ApiResponse<Employee>> salvar(@RequestBody Employee employee) {
        ApiResponse<Employee> resposta = employeeService.salvar(employee);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }
}
