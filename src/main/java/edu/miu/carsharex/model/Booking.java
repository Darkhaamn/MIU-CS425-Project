package edu.miu.carsharex.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Booking entity – a rental reservation linking a customer to one or more cars.
 * Each booking has exactly one payment (one-to-one).
 */
@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    private LocalDate pickupDate;

    private LocalDate returnDate;

    private double totalPrice;

    private String bookingStatus = "PENDING";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    /** Class diagram: one booking can involve one or more cars. */
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "booking_cars",
            joinColumns = @JoinColumn(name = "booking_id"),
            inverseJoinColumns = @JoinColumn(name = "car_id")
    )
    private List<Car> cars = new ArrayList<>();

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private Payment payment;

    /** Returns the number of rental days between pickup and return. */
    public long calculateDuration() {
        if (pickupDate == null || returnDate == null) {
            return 0;
        }
        return ChronoUnit.DAYS.between(pickupDate, returnDate);
    }
}
