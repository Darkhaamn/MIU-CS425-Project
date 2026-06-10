package edu.miu.carsharex.controller;

import edu.miu.carsharex.service.CarService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    private final CarService carService;

    public HomeController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("cars", carService.findAvailable());
        return "index";
    }
}
