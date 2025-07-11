package com.qt.careplus.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminRepository adminRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {
        Admin admin = null;
        System.out.println(request);
        try {
            Byte id = Byte.parseByte(request.getIdentifier());
            admin = adminRepository.findById(id).orElse(null);
        } catch (NumberFormatException e) {
            admin = adminRepository.findByNumber(request.getIdentifier());
        }

        if (admin != null && admin.getPassword().equals(request.getPassword())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("name", admin.getName());
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<String> createAdmin(@RequestBody Admin admin) {
        try {
            adminRepository.save(admin);
            return ResponseEntity.ok("Admin created successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create admin: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateAdmin(@PathVariable Byte id, @RequestBody Admin updatedAdmin) {
        try {
            Admin admin = adminRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            admin.setName(updatedAdmin.getName());
            admin.setNumber(updatedAdmin.getNumber());
            admin.setPassword(updatedAdmin.getPassword());

            adminRepository.save(admin);
            return ResponseEntity.ok("Admin updated successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update admin: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable Byte id) {
        try {
            Admin admin = adminRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            adminRepository.delete(admin);
            return ResponseEntity.ok("Admin deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete admin: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        try {
            List<Admin> admins = adminRepository.findAll();
            return ResponseEntity.ok(admins);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable Byte id) {

        try {
            Admin admin = adminRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}
