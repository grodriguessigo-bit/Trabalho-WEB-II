package com.web2.trabalhoFinal.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarSenhaCadastro(String emailDestino, String senhaGerada) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(emailDestino);
        message.setSubject("Bem-vindo! Sua senha de acesso");
        message.setText("Seu cadastro foi realizado com sucesso!\n\n" +
                "Sua senha de acesso de 4 dígitos é: " + senhaGerada + "\n\n" +
                "Recomendamos alterá-la após o primeiro login.");

        mailSender.send(message);
    }
}