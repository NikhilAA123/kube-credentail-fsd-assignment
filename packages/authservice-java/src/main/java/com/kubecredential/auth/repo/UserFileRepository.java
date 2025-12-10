package com.kubecredential.auth.repo;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kubecredential.auth.config.AuthProperties;
import com.kubecredential.auth.model.User;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UserFileRepository {

    private final ObjectMapper objectMapper;
    private final AuthProperties authProperties;

    private Path dataDir;
    private Path usersFile;

    public UserFileRepository(ObjectMapper objectMapper, AuthProperties authProperties) {
        this.objectMapper = objectMapper;
        this.authProperties = authProperties;
    }

    @PostConstruct
    public void init() throws IOException {
        // dataDir = /app/data (from application.yml / env)
        this.dataDir = Paths.get(authProperties.getDataDir());
        this.usersFile = dataDir.resolve("users.json");

        Files.createDirectories(dataDir);
        if (Files.notExists(usersFile)) {
            Files.writeString(usersFile, "[]", StandardOpenOption.CREATE);
        }
    }

    private List<User> readUsers() throws IOException {
        String raw = Files.readString(usersFile);
        try {
            List<User> users = objectMapper.readValue(raw, new TypeReference<List<User>>() {});
            return users != null ? users : new ArrayList<>();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private void writeUsers(List<User> users) throws IOException {
        String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(users);
        Files.writeString(usersFile, json, StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.CREATE);
    }

    public void createUser(User user) throws IOException {
        List<User> users = readUsers();
        users.add(user);
        writeUsers(users);
    }

    public Optional<User> findByEmail(String email) throws IOException {
        List<User> users = readUsers();
        String lower = email.toLowerCase();
        return users.stream()
                .filter(u -> u.getEmail() != null && u.getEmail().toLowerCase().equals(lower))
                .findFirst();
    }
}
