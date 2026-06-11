package edu.miu.carsharex.repository;

import edu.miu.carsharex.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByAvailabilityStatusTrue();
    List<Car> findBySupplier_SupplierId(Long supplierId);
    List<Car> findByBrandContainingIgnoreCaseOrModelContainingIgnoreCase(String brand, String model);
    List<Car> findByCarTypeIgnoreCase(String carType);
}
