package edu.miu.carsharex.api.dto;

import jakarta.validation.constraints.NotBlank;

public record SupplierRegisterRequest(
        @NotBlank String companyName,
        String supplierType,
        @NotBlank String email,
        @NotBlank String password
) {}
