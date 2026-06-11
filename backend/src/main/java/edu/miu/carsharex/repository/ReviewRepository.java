package edu.miu.carsharex.repository;

import edu.miu.carsharex.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCar_CarId(Long carId);
    List<Review> findByCustomer_UserId(Long customerId);
}
