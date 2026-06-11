package edu.miu.carsharex.api.dto;

import java.time.LocalDate;

public record ReviewResponse(
        Long reviewId,
        int rating,
        String comment,
        LocalDate reviewDate,
        String customerName
) {}
