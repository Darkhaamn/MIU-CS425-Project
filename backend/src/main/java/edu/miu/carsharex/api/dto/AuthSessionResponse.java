package edu.miu.carsharex.api.dto;

public record AuthSessionResponse(
        String role,
        Long id,
        String name,
        String email
) {}
