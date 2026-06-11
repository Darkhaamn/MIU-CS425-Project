package edu.miu.carsharex.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AdminRequest(
        @NotBlank String fullName,
        @Email @NotBlank String email,
        String password,
        String role
) {}
