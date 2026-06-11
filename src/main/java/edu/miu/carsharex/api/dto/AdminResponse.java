package edu.miu.carsharex.api.dto;

public record AdminResponse(
        Long adminId,
        String fullName,
        String email,
        String role
) {}
