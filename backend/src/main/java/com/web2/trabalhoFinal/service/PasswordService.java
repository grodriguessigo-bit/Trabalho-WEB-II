package com.web2.trabalhoFinal.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;

@Service
public class PasswordService {

    private final SecureRandom random = new SecureRandom();

    public String generatePassword() {
        return String.format("%04d", random.nextInt(10000));
    }

    public String generateSalt() {
        byte[] bytes = new byte[16];
        random.nextBytes(bytes);

        return HexFormat.of().formatHex(bytes);
    }

    public String hashPassword(String password, String salt) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                (salt + password).getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("sha-256 indisponível.", e);
        }
    }

    public boolean matches(String password, String storedHash, String salt) {
        if (password == null || storedHash == null || salt == null) {
            return false;
        }

        String calculatedHash = hashPassword(password, salt);

        return MessageDigest.isEqual(
            calculatedHash.getBytes(StandardCharsets.UTF_8),
            storedHash.getBytes(StandardCharsets.UTF_8)
        );
    }
}