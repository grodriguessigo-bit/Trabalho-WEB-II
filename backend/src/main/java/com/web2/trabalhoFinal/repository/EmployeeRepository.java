package com.web2.trabalhoFinal.repository;

import com.web2.trabalhoFinal.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCaseAndIdPersonNot(String email, long idPerson);

    List<Employee> findAllByActiveTrueOrderByNameAsc();

    long countByActiveTrue();
}