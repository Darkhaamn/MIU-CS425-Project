package edu.miu.carsharex.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record CarRequest(
        @NotBlank String brand,
        @NotBlank String model,
        @Positive double pricePerDay,
        String carType,
        boolean availabilityStatus
) {}
