package edu.miu.carsharex.service;

import edu.miu.carsharex.model.Car;
import edu.miu.carsharex.model.Customer;
import edu.miu.carsharex.model.Review;
import edu.miu.carsharex.repository.CarRepository;
import edu.miu.carsharex.repository.CustomerRepository;
import edu.miu.carsharex.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CustomerRepository customerRepository;
    private final CarRepository carRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         CustomerRepository customerRepository,
                         CarRepository carRepository) {
        this.reviewRepository = reviewRepository;
        this.customerRepository = customerRepository;
        this.carRepository = carRepository;
    }

    public List<Review> findAll() {
        return reviewRepository.findAll();
    }

    public Optional<Review> findById(Long id) {
        return reviewRepository.findById(id);
    }

    public List<Review> findByCar(Long carId) {
        return reviewRepository.findByCar_CarId(carId);
    }

    public Review addReview(Long customerId, Long carId, int rating, String comment) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new IllegalArgumentException("Car not found"));
        Review review = new Review();
        review.setCustomer(customer);
        review.setCar(car);
        review.setRating(rating);
        review.setComment(comment);
        review.setReviewDate(LocalDate.now());
        return reviewRepository.save(review);
    }

    public Review updateReview(Long id, int rating, String comment) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        review.setRating(rating);
        review.setComment(comment);
        return reviewRepository.save(review);
    }

    public void deleteById(Long id) {
        reviewRepository.deleteById(id);
    }
}
