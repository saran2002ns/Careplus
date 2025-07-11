package com.qt.careplus.appointment;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.qt.careplus.doctor.DoctorDTO;
import com.qt.careplus.doctor.DoctorRepository;
import com.qt.careplus.doctor.DoctorWithDatesDTO;
import com.qt.careplus.doctor.doctordate.DoctorDate;
import com.qt.careplus.doctor.doctordate.DoctorDateDTO;
import com.qt.careplus.doctor.doctordate.DoctorDateRepository;
import com.qt.careplus.doctor.doctordate.DoctorDateService;
import com.qt.careplus.doctor.doctortime.TimeSlot;
import com.qt.careplus.patient.Patient;
import com.qt.careplus.patient.PatientRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorDateService doctorDateService;
    private final DoctorDateRepository doctorDateRepository;

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDTO> getAppointmentById(@PathVariable Long id) {
        try {
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);

            if (appointmentOpt.isPresent()) {
                AppointmentDTO dto = toDTO(appointmentOpt.get());
                return ResponseEntity.ok(dto);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping
    public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
        try {
            List<AppointmentDTO> appointmentList = appointmentRepository.findAll().stream()
                .map(this::toDTO)
                .toList();

            return ResponseEntity.ok(appointmentList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @PostMapping
    public ResponseEntity<String> createAppointment(@RequestBody Appointment appointment) {
        try {
           
            Appointment savedAppointment = appointmentRepository.save(appointment);
            Optional<Patient> patientOpt = patientRepository.findById(appointment.getPatientId());

            if (patientOpt.isPresent()) {
                Patient patient = patientOpt.get();
                patient.setAllocated(true);
                patientRepository.save(patient);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                    .body("Patient not found.");
            }
           
            Optional<DoctorDate> doctorDateOpt =
                doctorDateRepository.findByDoctorIdAndDate(appointment.getDocterId(), appointment.getDate());

            if (doctorDateOpt.isPresent()) {
                DoctorDate doctorDate = doctorDateOpt.get();
                boolean timeSlotFound = false;
                for (TimeSlot slot : doctorDate.getTimeSlots()) {
                    if (slot.getTime().trim().equalsIgnoreCase(appointment.getTime().trim())) {
                        slot.setAvailable(false);
                        timeSlotFound = true;
                        break;
                    }
                }

                if (!timeSlotFound) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body("Time slot not found for doctor on selected date.");
                }
                doctorDateRepository.save(doctorDate); 
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                    .body("Doctor availability not found for given date.");
            }
            return ResponseEntity.ok("Appointment created successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Failed to create appointment: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateAppointmentDateTime(
            @PathVariable Long id,
            @RequestBody Appointment updatedData) {
        try {
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
            if (appointmentOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found.");
            }

            Appointment existingAppointment = appointmentOpt.get();
            LocalDate oldDate = existingAppointment.getDate();
            String oldTime = existingAppointment.getTime();
            LocalDate newDate = updatedData.getDate();
            String newTime = updatedData.getTime();
            
            Optional<DoctorDate> oldDoctorDateOpt =
                    doctorDateRepository.findByDoctorIdAndDate(existingAppointment.getDocterId(), oldDate);

            if (oldDoctorDateOpt.isPresent()) {
                DoctorDate oldDoctorDate = oldDoctorDateOpt.get();
                for (TimeSlot slot : oldDoctorDate.getTimeSlots()) {
                    if (slot.getTime().trim().equalsIgnoreCase(oldTime.trim())) {
                        slot.setAvailable(true);
                        break;
                    }
                }
                doctorDateRepository.save(oldDoctorDate);
            }

            Optional<DoctorDate> newDoctorDateOpt =
                    doctorDateRepository.findByDoctorIdAndDate(existingAppointment.getDocterId(), newDate);
            boolean foundNewTimeSlot = false;
            if (newDoctorDateOpt.isPresent()) {
                DoctorDate newDoctorDate = newDoctorDateOpt.get();
                for (TimeSlot slot : newDoctorDate.getTimeSlots()) {
                    if (slot.getTime().trim().equalsIgnoreCase(newTime.trim())) {
                        if (!slot.isAvailable()) {
                            return ResponseEntity.status(HttpStatus.CONFLICT)
                                    .body("Selected time slot is already booked.");
                        }
                        slot.setAvailable(false);
                        foundNewTimeSlot = true;
                        break;
                    }
                }

                if (!foundNewTimeSlot) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("New time slot not found.");
                }
                doctorDateRepository.save(newDoctorDate);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("New doctor date not found.");
            }

           
            existingAppointment.setDate(newDate);
            existingAppointment.setTime(newTime);
            appointmentRepository.save(existingAppointment);
            return ResponseEntity.ok("Appointment date/time updated successfully.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update appointment: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable Long id) {
        try {
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
            if (appointmentOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                    .body("Appointment not found with ID: " + id);
            }
            Appointment appointment = appointmentOpt.get();
            Optional<DoctorDate> doctorDateOpt = doctorDateRepository
                .findByDoctorIdAndDate(appointment.getDocterId(), appointment.getDate());

            if (doctorDateOpt.isPresent()) {
                DoctorDate doctorDate = doctorDateOpt.get();
                for (TimeSlot slot : doctorDate.getTimeSlots()) {
                    if (slot.getTime().trim().equalsIgnoreCase(appointment.getTime().trim())) {
                        slot.setAvailable(true);
                        break;
                    }
                }
                doctorDateRepository.save(doctorDate);
            }
            Optional<Patient> patientOpt = patientRepository.findById(appointment.getPatientId());
            patientOpt.ifPresent(patient -> {
                patient.setAllocated(false);
                patientRepository.save(patient);
            });
            appointmentRepository.deleteById(id);
            return ResponseEntity.ok("Appointment deleted and changes reversed successfully.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Failed to delete appointment: " + e.getMessage());
        }
    }


    @GetMapping("/patient/{id}")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByPatientId(@PathVariable Integer id) {
        try {
            List<AppointmentDTO> list = appointmentRepository.findAll().stream()
                    .filter(app -> app.getPatientId().equals(id))
                    .map(this::toDTO)
                    .toList();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/patient/search")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByPatientName(@RequestParam String name) {
        try {
            List<AppointmentDTO> list = appointmentRepository.findAll().stream()
                    .filter(app -> {
                        var patient = patientRepository.findById(app.getPatientId()).orElse(null);
                        return patient != null && patient.getName().toLowerCase().contains(name.toLowerCase());
                    })
                    .map(this::toDTO)
                    .toList();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/doctor/{id}")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByDoctorId(@PathVariable Long id) {
        try {
            List<AppointmentDTO> list = appointmentRepository.findAll().stream()
                    .filter(app -> app.getDocterId().equals(id.intValue()))
                    .map(this::toDTO)
                    .toList();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/doctor/search")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByDoctorName(@RequestParam String name) {
        try {
            List<AppointmentDTO> list = appointmentRepository.findAll().stream()
                    .filter(app -> {
                        var doctor = doctorRepository.findById(app.getDocterId().longValue()).orElse(null);
                        return doctor != null && doctor.getName().toLowerCase().contains(name.toLowerCase());
                    })
                    .map(this::toDTO)
                    .toList();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private AppointmentDTO toDTO(Appointment entity) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(entity.getId());
        dto.setDate(entity.getDate());
        dto.setTime(entity.getTime());
        dto.setPatient(patientRepository.findById(entity.getPatientId()).orElse(null));

        doctorRepository.findById(entity.getDocterId().longValue()).ifPresent(doctor -> {
            DoctorDTO doctorDTO = new DoctorDTO();
            doctorDTO.setDoctorId(doctor.getId());
            doctorDTO.setName(doctor.getName());
            doctorDTO.setNumber(doctor.getNumber());
            doctorDTO.setAge(doctor.getAge());
            doctorDTO.setGender(doctor.getGender());

            if (doctor.getSpecialist() != null) {
                doctorDTO.setSpecialistId(doctor.getSpecialist().getSpecialistId());
                doctorDTO.setSpecialist(doctor.getSpecialist().getName());
            }
            List<DoctorDateDTO> dates = doctorDateService.getDatesForDoctor(doctor.getId());
            DoctorWithDatesDTO withDates = new DoctorWithDatesDTO(doctorDTO, dates);
            dto.setDocter(withDates);
        });

        return dto;
    }
}
