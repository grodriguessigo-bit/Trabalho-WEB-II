package com.web2.trabalhoFinal.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class PasswordService {

    private static final SecureRandom RANDOM = new SecureRandom();

    public String generatePassword() {
        int password = RANDOM.nextInt(10000);

        return String.format("%04d", password);
    }

    public String generateSalt() {
        byte[] salt = new byte[16];

        RANDOM.nextBytes(salt);

        return Base64.getEncoder()
                .encodeToString(salt);
    }

    public String hashPassword(String password, String salt) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            String passwordWithSalt = password + salt;

            byte[] hash = digest.digest(
                    passwordWithSalt.getBytes(StandardCharsets.UTF_8)
            );

            return Base64.getEncoder()
                    .encodeToString(hash);

        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "SHA-256 algorithm not available",
                    exception
            );
        }
    }

    public boolean matches(
            String password,
            String storedHash,
            String salt
    ) {
        String calculatedHash = hashPassword(password, salt);

        return calculatedHash.equals(storedHash);
    }
}