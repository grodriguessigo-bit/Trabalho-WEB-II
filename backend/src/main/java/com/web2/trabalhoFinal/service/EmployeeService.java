package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.Employee;
import com.web2.trabalhoFinal.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional
    public ApiResponse<Employee> salvar(Employee employee) {
        Employee salvo = employeeRepository.save(employee);
        return new ApiResponse<>(salvo, "Funcionário salvo com sucesso", true);
    }
}