package edu.miu.carsharex.repository;

import edu.miu.carsharex.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer_UserId(Long customerId);
    List<Booking> findByCars_CarId(Long carId);
}
