package edu.miu.carsharex.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CustomerRequest(
        @NotBlank String fullName,
        @Email @NotBlank String email,
        String phoneNumber,
        String password,
        String address
) {}
