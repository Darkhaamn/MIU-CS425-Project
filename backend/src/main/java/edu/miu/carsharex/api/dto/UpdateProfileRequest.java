package edu.miu.carsharex.api.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
        @NotBlank String fullName,
        String phoneNumber,
        String address,
        String password
) {}
