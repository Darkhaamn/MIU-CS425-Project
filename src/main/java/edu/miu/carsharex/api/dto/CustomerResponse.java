package edu.miu.carsharex.api.dto;

public record CustomerResponse(
        Long userId,
        String fullName,
        String email,
        String phoneNumber,
        String address
) {}
