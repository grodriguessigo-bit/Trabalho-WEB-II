package com.web2.trabalhoFinal.dto;
import com.web2.trabalhoFinal.entities.Employee;
import java.time.LocalDate;

public record EmployeeResponse(Long id, String name, String email, LocalDate birthDate, boolean active) {

    public static EmployeeResponse from(Employee employee) {
        return new EmployeeResponse(
                employee.getId_person(),
                employee.getName(),
                employee.getEmail(),
                employee.getBirthDate(),
                employee.isActive());
    }
}