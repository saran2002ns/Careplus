package com.qt.careplus.receptionist;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/receptionists")
@RequiredArgsConstructor
public class ReceptionistController {

    private final ReceptionistRepository receptionistRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody ReceptionistLoginRequest request) {
        Receptionist receptionist = null;
        System.out.println(request);

        try {
            Integer id = Integer.parseInt(request.getIdentifier());
            receptionist = receptionistRepository.findById(id).orElse(null);
        } catch (NumberFormatException e) {
            receptionist = receptionistRepository.findByNumber(request.getIdentifier());
        }

        if (receptionist != null && receptionist.getPassword().equals(request.getPassword())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("name", receptionist.getName());
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<List<Receptionist>> getAllReceptionists() {
        try {
            return ResponseEntity.ok(receptionistRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receptionist> getReceptionistById(@PathVariable Integer id) {
        try {
            Receptionist rec = receptionistRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Receptionist not found"));
            return ResponseEntity.ok(rec);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Receptionist>> getReceptionistByName(@RequestParam String name) {
        try {
            List<Receptionist> results = receptionistRepository.findByNameContainingIgnoreCase(name);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<String> createReceptionist(@RequestBody Receptionist receptionist) {
        try {

            if (receptionistRepository.existsByNumber(receptionist.getNumber())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Receptionist with this number already exists.");
            }

            receptionistRepository.save(receptionist);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Receptionist added successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to add receptionist: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something went wrong on the server.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateReceptionist(@PathVariable Integer id, @RequestBody Receptionist updated) {
        try {
            Receptionist existing = receptionistRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Receptionist not found"));

            existing.setName(updated.getName());
            existing.setNumber(updated.getNumber());
            existing.setPassword(updated.getPassword());

            receptionistRepository.save(existing);
            return ResponseEntity.ok("Receptionist updated successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update receptionist: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReceptionist(@PathVariable Integer id) {
        try {
            Receptionist existing = receptionistRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Receptionist not found"));
            receptionistRepository.delete(existing);
            return ResponseEntity.ok("Receptionist deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete receptionist: " + e.getMessage());
        }
    }
}
