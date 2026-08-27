package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.model.User;
import com.web2.trabalhoFinal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        if (userRepository.existsByCpf(user.getCpf())) {
            throw new RuntimeException("CPF is already registered in the system.");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already registered in the system.");
        }
        String randomPassword = String.format("%04d", new Random().nextInt(10000));
        user.setRandomPassword(randomPassword);
        User savedUser = userRepository.save(user);
        sendEmailWithPassword(savedUser.getEmail(), randomPassword);
        return savedUser;
    }

    private void sendEmailWithPassword(String recipient, String password) {
        System.out.println("--- EMAIL SENT ---");
        System.out.println("To: " + recipient);
        System.out.println("Your temporary access password is: " + password);
        System.out.println("------------------");
    }
}