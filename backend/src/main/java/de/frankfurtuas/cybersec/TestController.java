package de.frankfurtuas.cybersec;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class TestController {

    @GetMapping("/public")
    public String publicEndpoint() {
        return "Public endpoint accessible without authentication!";
    }

    @GetMapping("/protected")
    public String protectedEndpoint() {
        return "Protected endpoint, only accessible with valid authentication!";
    }
}
