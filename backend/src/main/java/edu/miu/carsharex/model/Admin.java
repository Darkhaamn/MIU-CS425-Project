package edu.miu.carsharex.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Admin entity – system administrators with platform-wide access.
 * Admins are managed separately from customers and suppliers per the class diagram.
 */
@Entity
@Table(name = "admins")
@Getter
@Setter
@NoArgsConstructor
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminId;

    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    @Column(unique = true)
    private String email;

    private String password;

    private String role = "ADMIN";
}
