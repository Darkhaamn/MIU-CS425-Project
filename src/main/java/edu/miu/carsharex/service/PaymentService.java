package edu.miu.carsharex.service;

import edu.miu.carsharex.model.Booking;
import edu.miu.carsharex.model.Customer;
import edu.miu.carsharex.model.Payment;
import edu.miu.carsharex.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * PaymentService – mocks interaction with an external Payment System (use case diagram).
 */
@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public List<Payment> findAll() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> findById(Long id) {
        return paymentRepository.findById(id);
    }

    public List<Payment> findByCustomer(Long customerId) {
        return paymentRepository.findByCustomer_UserId(customerId);
    }

    /** Simulates payment processing through an external gateway. */
    public Payment processPayment(Booking booking, Customer customer, String paymentMethod) {
        Payment payment = new Payment();
        payment.setAmount(booking.getTotalPrice());
        payment.setPaymentMethod(paymentMethod);
        payment.setBooking(booking);
        payment.setCustomer(customer);
        payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setPaymentStatus(validatePayment(payment) ? "COMPLETED" : "FAILED");
        return paymentRepository.save(payment);
    }

    public boolean validatePayment(Payment payment) {
        return payment.getAmount() > 0 && payment.getPaymentMethod() != null;
    }

    public Payment refundPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        payment.setPaymentStatus("REFUNDED");
        return paymentRepository.save(payment);
    }

    public void deleteById(Long id) {
        paymentRepository.deleteById(id);
    }
}
