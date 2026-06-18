package com.placement.mgt;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@SpringBootApplication
public class PlacementManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlacementManagementApplication.class, args);
    }

    @Bean
    public CommandLineRunner init() {
        return args -> {
            try {
                Files.createDirectories(Paths.get("./uploads/resumes"));
                System.out.println("Local upload directory './uploads/resumes' successfully verified/created.");
            } catch (IOException e) {
                System.err.println("Could not create local upload directory: " + e.getMessage());
            }
        };
    }
}
