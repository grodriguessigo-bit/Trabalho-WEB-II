package com.web2.trabalhoFinal.repository;

import com.web2.trabalhoFinal.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    long countByActiveTrue();
}
