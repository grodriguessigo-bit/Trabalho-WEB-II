package com.web2.trabalhoFinal.repository;

import com.web2.trabalhoFinal.entities.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface PersonRepository extends JpaRepository<Person, Long> {
    @Query("SELECT COUNT(p) > 0 FROM Person p WHERE p.email = :email AND p.id <> :id")
    boolean existsByEmailAndOtherId(@Param("email") String email, @Param("id") Long id);
    boolean existsByEmail(@Param("email") String email);
    public Optional<Person> findByEmail(String email);
}
