package com.web2.trabalhoFinal.repository;

import com.web2.trabalhoFinal.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByEmailIgnoreCase(String email);

    @Query("select count(e) > 0 from Employee e "
            + "where lower(e.email) = lower(:email) and e.id_person <> :id")
    boolean existsByEmailAndIdNot(@Param("email") String email, @Param("id") long id);

    List<Employee> findAllByActiveTrueOrderByNameAsc();

    long countByActiveTrue();
}