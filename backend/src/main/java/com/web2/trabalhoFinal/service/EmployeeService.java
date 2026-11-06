package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.entities.Employee;
import com.web2.trabalhoFinal.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<Employee> listActive() {
        return employeeRepository.findAllByActiveTrueOrderByNameAsc();
    }

    @Transactional(readOnly = true)
    public Employee findById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Funcionário não encontrado."));
    }

    @Transactional
    public Employee create(Employee employee) {
        validateEmployee(employee);

        if (employeeRepository.existsByEmailIgnoreCase(employee.getEmail())) {
            throw new IllegalArgumentException(
                    "Já existe um funcionário cadastrado com este e-mail."
            );
        }

        employee.setActive(true);

        return employeeRepository.save(employee);
    }

    @Transactional
    public Employee update(Long id, Employee data) {
        Employee employee = findById(id);

        validateEmployee(data);

        if (employeeRepository.existsByEmailIgnoreCaseAndIdPersonNot(
                data.getEmail(),
                employee.getId_person()
        )) {
            throw new IllegalArgumentException(
                    "Já existe outro funcionário com este e-mail."
            );
        }

        employee.setName(data.getName().trim());
        employee.setEmail(data.getEmail().trim());
        employee.setBirthDate(data.getBirthDate());

        return employeeRepository.save(employee);
    }

    private void validateEmployee(Employee employee) {
        if (employee == null) {
            throw new IllegalArgumentException(
                    "Os dados do funcionário são obrigatórios."
            );
        }

        if (employee.getName() == null || employee.getName().isBlank()) {
            throw new IllegalArgumentException(
                    "O nome do funcionário é obrigatório."
            );
        }

        if (employee.getEmail() == null || employee.getEmail().isBlank()) {
            throw new IllegalArgumentException(
                    "O e-mail do funcionário é obrigatório."
            );
        }

        if (employee.getBirthDate() == null) {
            throw new IllegalArgumentException(
                    "A data de nascimento é obrigatória."
            );
        }
    }
}