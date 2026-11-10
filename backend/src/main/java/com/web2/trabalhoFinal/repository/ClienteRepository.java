package com.web2.trabalhoFinal.repository;

import com.web2.trabalhoFinal.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Client, Long> {
    boolean existsByCpf(String cpf);
}
