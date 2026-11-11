package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.entities.Employee;
import com.web2.trabalhoFinal.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EmployeePermission {

    private final EmployeeRepository employeeRepository;

    public EmployeePermission(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public void verificar(Long employeeId) {
        if (employeeId == null) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Entre como funcionário."
            );
        }

        Employee funcionario = employeeRepository.findById(employeeId).orElse(null);

        if (funcionario == null || !funcionario.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Funcionário inativo ou não encontrado."
            );
        }
    }
}