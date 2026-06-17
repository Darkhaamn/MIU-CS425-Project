package edu.miu.carsharex.api;

import edu.miu.carsharex.api.dto.*;
import edu.miu.carsharex.api.mapper.DtoMapper;
import edu.miu.carsharex.config.SessionConstants;
import edu.miu.carsharex.model.Car;
import edu.miu.carsharex.service.BookingService;
import edu.miu.carsharex.service.CarImageStorageService;
import edu.miu.carsharex.service.CarService;
import edu.miu.carsharex.service.ReportService;
import edu.miu.carsharex.service.SupplierService;
import edu.miu.carsharex.service.VerificationService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/supplier")
public class SupplierApiController {

    private final SupplierService supplierService;
    private final CarService carService;
    private final BookingService bookingService;
    private final ReportService reportService;
    private final VerificationService verificationService;
    private final CarImageStorageService carImageStorageService;
    private final DtoMapper mapper;

    public SupplierApiController(SupplierService supplierService,
                                 CarService carService,
                                 BookingService bookingService,
                                 ReportService reportService,
                                 VerificationService verificationService,
                                 CarImageStorageService carImageStorageService,
                                 DtoMapper mapper) {
        this.supplierService = supplierService;
        this.carService = carService;
        this.bookingService = bookingService;
        this.reportService = reportService;
        this.verificationService = verificationService;
        this.carImageStorageService = carImageStorageService;
        this.mapper = mapper;
    }

    @GetMapping("/dashboard")
    @Transactional(readOnly = true)
    public SupplierDashboardResponse dashboard(HttpSession session) {
        Long supplierId = requireSupplier(session);
        var supplier = supplierService.findById(supplierId).orElseThrow();
        var cars = mapper.toCarResponses(carService.findBySupplier(supplierId));
        return new SupplierDashboardResponse(mapper.toSupplierResponse(supplier), cars);
    }

    @GetMapping("/cars")
    @Transactional(readOnly = true)
    public List<CarResponse> listCars(HttpSession session) {
        Long supplierId = requireSupplier(session);
        return mapper.toCarResponses(carService.findBySupplier(supplierId));
    }

    @PostMapping("/cars/upload-image")
    public CarImageUploadResponse uploadCarImage(@RequestParam("image") MultipartFile image,
                                                 HttpSession session) {
        requireSupplier(session);
        return new CarImageUploadResponse(carImageStorageService.store(image));
    }

    @PostMapping("/cars")
    public CarResponse addCar(@Valid @RequestBody CarRequest request, HttpSession session) {
        Long supplierId = requireSupplier(session);
        Car car = toCarEntity(request);
        return mapper.toCarResponse(carService.save(car, supplierId));
    }

    @PutMapping("/cars/{id}")
    @Transactional
    public CarResponse updateCar(@PathVariable Long id, @Valid @RequestBody CarRequest request,
                                 HttpSession session) {
        requireSupplier(session);
        Car car = toCarEntity(request);
        return mapper.toCarResponse(carService.update(id, car));
    }

    @DeleteMapping("/cars/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id, HttpSession session) {
        requireSupplier(session);
        carService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/cars/{id}/availability")
    @Transactional
    public CarResponse toggleAvailability(@PathVariable Long id,
                                          @RequestBody AvailabilityRequest request,
                                          HttpSession session) {
        requireSupplier(session);
        return mapper.toCarResponse(carService.updateAvailability(id, request.available()));
    }

    @GetMapping("/orders")
    @Transactional(readOnly = true)
    public List<BookingResponse> orders(HttpSession session) {
        Long supplierId = requireSupplier(session);
        List<edu.miu.carsharex.model.Booking> orders = new ArrayList<>();
        for (Car car : carService.findBySupplier(supplierId)) {
            orders.addAll(bookingService.findByCar(car.getCarId()));
        }
        return mapper.toBookingResponses(orders);
    }

    @GetMapping("/reports")
    @Transactional(readOnly = true)
    public List<ReportResponse> reports(HttpSession session) {
        Long supplierId = requireSupplier(session);
        return mapper.toReportResponses(reportService.findBySupplier(supplierId));
    }

    @PostMapping("/reports/generate")
    @Transactional
    public ReportResponse generateReport(HttpSession session) {
        Long supplierId = requireSupplier(session);
        return mapper.toReportResponse(reportService.generateSummary(supplierId));
    }

    @GetMapping("/verification")
    @Transactional(readOnly = true)
    public ResponseEntity<VerificationResponse> verification(HttpSession session) {
        Long supplierId = requireSupplier(session);
        return verificationService.findBySupplier(supplierId)
                .map(v -> ResponseEntity.ok(mapper.toVerificationResponse(
                        v, verificationService.findDocuments(v.getVerificationId())
                )))
                .orElse(ResponseEntity.noContent().build());
    }

    private Car toCarEntity(CarRequest request) {
        Car car = new Car();
        car.setBrand(request.brand());
        car.setModel(request.model());
        car.setPricePerDay(request.pricePerDay());
        car.setCarType(request.carType());
        car.setAvailabilityStatus(request.availabilityStatus());
        car.setImageUrl(request.imageUrl());
        return car;
    }

    private Long requireSupplier(HttpSession session) {
        Long supplierId = (Long) session.getAttribute(SessionConstants.SUPPLIER_ID);
        if (supplierId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Supplier login required");
        }
        return supplierId;
    }

    public record SupplierDashboardResponse(SupplierResponse supplier, List<CarResponse> cars) {}
}
