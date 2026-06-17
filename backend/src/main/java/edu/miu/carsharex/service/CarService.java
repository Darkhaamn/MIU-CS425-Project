package edu.miu.carsharex.service;

import edu.miu.carsharex.model.Car;
import edu.miu.carsharex.model.Supplier;
import edu.miu.carsharex.repository.CarRepository;
import edu.miu.carsharex.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CarService {

    private final CarRepository carRepository;
    private final SupplierRepository supplierRepository;
    private final VerificationService verificationService;

    public CarService(CarRepository carRepository,
                      SupplierRepository supplierRepository,
                      VerificationService verificationService) {
        this.carRepository = carRepository;
        this.supplierRepository = supplierRepository;
        this.verificationService = verificationService;
    }

    public List<Car> findAll() {
        return carRepository.findAll();
    }

    public List<Car> findAvailable() {
        return carRepository.findByAvailabilityStatusTrue();
    }

    public Optional<Car> findById(Long id) {
        return carRepository.findById(id);
    }

    public List<Car> findBySupplier(Long supplierId) {
        return carRepository.findBySupplier_SupplierId(supplierId);
    }

    /** Search / filter cars by keyword or type (customer use case). */
    public List<Car> search(String keyword, String carType) {
        if (carType != null && !carType.isBlank()) {
            return carRepository.findByCarTypeIgnoreCase(carType);
        }
        if (keyword != null && !keyword.isBlank()) {
            return carRepository.findByBrandContainingIgnoreCaseOrModelContainingIgnoreCase(keyword, keyword);
        }
        return findAvailable();
    }

    public Car save(Car car, Long supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found"));
        requireApprovedSupplier(supplier);
        if (car.getImageUrl() == null || car.getImageUrl().isBlank()) {
            throw new IllegalArgumentException("Car image is required");
        }
        car.setSupplier(supplier);
        verificationService.verifyCar(car);
        return carRepository.save(car);
    }

    public Car update(Long id, Car updated) {
        Car existing = carRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Car not found"));
        existing.setBrand(updated.getBrand());
        existing.setModel(updated.getModel());
        existing.setPricePerDay(updated.getPricePerDay());
        existing.setCarType(updated.getCarType());
        existing.setAvailabilityStatus(updated.isAvailabilityStatus());
        if (updated.getImageUrl() != null && !updated.getImageUrl().isBlank()) {
            existing.setImageUrl(updated.getImageUrl());
        }
        return carRepository.save(existing);
    }

    private void requireApprovedSupplier(Supplier supplier) {
        if (!"APPROVED".equalsIgnoreCase(supplier.getVerificationStatus())) {
            throw new IllegalStateException(
                    "Your supplier verification must be approved by an admin before you can add cars");
        }
    }

    public void deleteById(Long id) {
        carRepository.deleteById(id);
    }

    public Car updateAvailability(Long id, boolean available) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Car not found"));
        car.updateAvailability(available);
        return carRepository.save(car);
    }
}
