package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.Redirect;
import com.web2.trabalhoFinal.service.RedirectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/redirects")
@CrossOrigin(origins = "http://localhost:4200")
public class RedirectController {

    private final RedirectService redirectService;

    public RedirectController(RedirectService redirectService) {
        this.redirectService = redirectService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Redirect>> salvar(@RequestBody Redirect redirect) {
        ApiResponse<Redirect> resposta = redirectService.salvar(redirect);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }
}
