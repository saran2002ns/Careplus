package com.qt.careplus.doctor;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.bind.annotation.*;

import com.qt.careplus.doctor.doctordate.DoctorDateDTO;
import com.qt.careplus.doctor.doctordate.DoctorDateService;
import com.qt.careplus.specialist.Specialist;
import com.qt.careplus.specialist.SpecialistRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorDateService doctorDateService;
    private final DoctorRepository doctorRepository;
    private final SpecialistRepository specialistRepository;

    
    @PostMapping
    public ResponseEntity<String> createDoctor(@RequestBody DoctorDTO request) {
        try {
            if (doctorRepository.existsByNumber(request.getNumber())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Doctor with this number already exists.");
            }

            Specialist specialist = specialistRepository.findById(request.getSpecialistId())
                    .orElseThrow(() -> new RuntimeException("Specialist not found"));

            Doctor doctor = new Doctor();
            doctor.setName(request.getName());
            doctor.setAge(request.getAge());
            doctor.setGender(request.getGender());
            doctor.setNumber(request.getNumber());
            doctor.setSpecialist(specialist);
            doctor.setAddress(request.getAddress());
            doctorRepository.save(doctor);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Doctor created successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to create doctor: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something went wrong on the server.");
        }
    }

    
    @GetMapping("/{doctorId}")
    public ResponseEntity<DoctorWithDatesDTO> getDoctor(@PathVariable Long doctorId) {
        try {
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            List<DoctorDateDTO> dates = doctorDateService.getDatesForDoctor(doctorId);
            DoctorDTO doctorDTO = toDoctorDTO(doctor);
            DoctorWithDatesDTO dto = new DoctorWithDatesDTO(doctorDTO, dates);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<DoctorWithDatesDTO>> searchDoctorsByName(@RequestParam String name) {
        try {
            List<Doctor> doctors = doctorRepository.findByNameContainingIgnoreCase(name);
            List<DoctorWithDatesDTO> result = doctors.stream().map(doctor -> {
                DoctorDTO dto = toDoctorDTO(doctor);
                List<DoctorDateDTO> dates = doctorDateService.getDatesForDoctor(doctor.getId());
                return new DoctorWithDatesDTO(dto, dates);
            }).toList();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private DoctorDTO toDoctorDTO(Doctor doctor) {
        return new DoctorDTO(
            doctor.getId(),
            doctor.getAge(),
            doctor.getGender(),
            doctor.getName(),
            doctor.getNumber(),
            doctor.getSpecialist().getSpecialistId(),
            doctor.getSpecialist().getName(),
            doctor.getAddress()
        );
    }


    @GetMapping("/{doctorId}/dates")
    public ResponseEntity<List<DoctorDateDTO>> getDoctorDates(@PathVariable Long doctorId) {
        try {
            List<DoctorDateDTO> dates = doctorDateService.getDatesForDoctor(doctorId);
            return ResponseEntity.ok(dates);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        try {
            List<Doctor> doctors = doctorRepository.findAll();
            List<DoctorDTO> dtos = doctors.stream().map(doctor -> {
                DoctorDTO dto = new DoctorDTO();
                dto.setDoctorId(doctor.getId());
                dto.setName(doctor.getName());
                dto.setAge(doctor.getAge());
                dto.setGender(doctor.getGender());
                dto.setNumber(doctor.getNumber());
                dto.setSpecialistId(doctor.getSpecialist().getSpecialistId());
                dto.setSpecialist(doctor.getSpecialist().getName());
                dto.setAddress(doctor.getAddress());
                return dto;
            }).toList();
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateDoctor(@PathVariable Long id, @RequestBody DoctorDTO updatedDoctor) {
        try {
            Doctor doctor = doctorRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            Specialist specialist = specialistRepository.findById(updatedDoctor.getSpecialistId())
                    .orElseThrow(() -> new RuntimeException("Specialist not found"));

            doctor.setName(updatedDoctor.getName());
            doctor.setAge(updatedDoctor.getAge());
            doctor.setGender(updatedDoctor.getGender());
            doctor.setNumber(updatedDoctor.getNumber());
            doctor.setSpecialist(specialist);

            doctorRepository.save(doctor);

            return ResponseEntity.ok("Doctor updated successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update doctor: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDoctor(@PathVariable Long id) {
        try {
            Doctor doctor = doctorRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            doctorRepository.delete(doctor);

            return ResponseEntity.ok("Doctor deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete doctor: " + e.getMessage());
        }
    }


   
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }
}
