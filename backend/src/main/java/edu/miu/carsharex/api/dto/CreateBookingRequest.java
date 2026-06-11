package edu.miu.carsharex.api.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record CreateBookingRequest(
        @NotEmpty List<Long> carIds,
        @NotNull LocalDate pickupDate,
        @NotNull LocalDate returnDate,
        String paymentMethod
) {}
