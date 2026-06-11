package edu.miu.carsharex.api;

import edu.miu.carsharex.api.dto.CarResponse;
import edu.miu.carsharex.api.dto.ReviewResponse;
import edu.miu.carsharex.api.mapper.DtoMapper;
import edu.miu.carsharex.service.CarService;
import edu.miu.carsharex.service.ReviewService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarApiController {

    private final CarService carService;
    private final ReviewService reviewService;
    private final DtoMapper mapper;

    public CarApiController(CarService carService, ReviewService reviewService, DtoMapper mapper) {
        this.carService = carService;
        this.reviewService = reviewService;
        this.mapper = mapper;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<CarResponse> availableCars() {
        return mapper.toCarResponses(carService.findAvailable());
    }

    @GetMapping("/search")
    @Transactional(readOnly = true)
    public List<CarResponse> searchCars(@RequestParam(required = false) String keyword,
                                        @RequestParam(required = false) String carType) {
        return mapper.toCarResponses(carService.search(keyword, carType));
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public CarResponse carDetails(@PathVariable Long id) {
        return mapper.toCarResponse(carService.findById(id).orElseThrow());
    }

    @GetMapping("/{id}/reviews")
    @Transactional(readOnly = true)
    public List<ReviewResponse> carReviews(@PathVariable Long id) {
        return mapper.toReviewResponses(reviewService.findByCar(id));
    }
}
