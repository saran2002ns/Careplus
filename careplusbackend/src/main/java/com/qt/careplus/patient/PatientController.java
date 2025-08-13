package com.qt.careplus.patient;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientRepository patientRepository;

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        try {
            return ResponseEntity.ok(patientRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        try {
            Patient patient = patientRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            return ResponseEntity.ok(patient);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Patient>> getPatientsByName(@RequestParam String name) {
        try {
            List<Patient> patients = patientRepository.findByNameContainingIgnoreCase(name);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PostMapping
    public ResponseEntity<String> createPatient(@RequestBody Patient patient) {
        if (patientRepository.existsByNumber(patient.getNumber())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Patient with this number already exists.");
        }
        try {
            patientRepository.save(patient);
            return ResponseEntity.status(HttpStatus.CREATED).body("Patient created successfully.");
         } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Failed to create patient: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to create patient: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updatePatient(@PathVariable Long id, @RequestBody Patient updatedPatient) {
        try {
            Patient existing = patientRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));

            existing.setName(updatedPatient.getName());
            existing.setNumber(updatedPatient.getNumber());
            existing.setDate(updatedPatient.getDate());
            existing.setTime(updatedPatient.getTime());
            existing.setAge(updatedPatient.getAge());
            existing.setGender(updatedPatient.getGender());
            existing.setAddress(updatedPatient.getAddress());
            existing.setAllocated(updatedPatient.isAllocated());

            patientRepository.save(existing);
            return ResponseEntity.ok("Patient updated successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to update patient: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePatient(@PathVariable Long id) {
        try {
            Patient existing = patientRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            patientRepository.delete(existing);
            return ResponseEntity.ok("Patient deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to delete patient: " + e.getMessage());
        }
    }
}
