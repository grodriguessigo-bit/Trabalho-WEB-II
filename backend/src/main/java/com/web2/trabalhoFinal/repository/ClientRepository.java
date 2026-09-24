package com.web2.trabalhoFinal.repository;

import com.web2.trabalhoFinal.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {


}
