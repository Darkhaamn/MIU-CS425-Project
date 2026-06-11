package edu.miu.carsharex.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * Car entity – vehicles available for rent.
 * Each car belongs to one supplier and can appear in many bookings and reviews.
 */
@Entity
@Table(name = "cars")
@Getter
@Setter
@NoArgsConstructor
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long carId;

    @NotBlank
    private String brand;

    @NotBlank
    private String model;

    @Positive
    private double pricePerDay;

    private boolean availabilityStatus = true;

    private String carType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToMany(mappedBy = "cars")
    private List<Booking> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    /** Calculates rental price for a given number of days. */
    public double calculatePrice(long days) {
        return pricePerDay * days;
    }

    public void markUnavailable() {
        this.availabilityStatus = false;
    }

    public void updateAvailability(boolean available) {
        this.availabilityStatus = available;
    }
}
