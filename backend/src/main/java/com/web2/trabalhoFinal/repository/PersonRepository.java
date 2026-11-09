package com.web2.trabalhoFinal.repository;

import com.web2.trabalhoFinal.entities.Person;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, Long> {
}
