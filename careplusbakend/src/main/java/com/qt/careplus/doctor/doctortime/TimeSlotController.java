package com.qt.careplus.doctor.doctortime;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/timeslots")
@RequiredArgsConstructor
public class TimeSlotController {

    private final TimeSlotRepository timeSlotRepository;

    @PutMapping("/{id}")
    public ResponseEntity<String> updateTimeSlot(@PathVariable Long id, @RequestBody TimeSlotDTO request) {
        try {

            TimeSlot timeSlot = timeSlotRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("TimeSlot not found"));
            timeSlot.setTime(request.getTime());
            timeSlot.setAvailable(request.isAvailable());
            timeSlotRepository.save(timeSlot);

            return ResponseEntity.ok("Time slot updated successfully.");
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to update time slot: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTimeSlot(@PathVariable Long id) {
        try {
            TimeSlot timeSlot = timeSlotRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("TimeSlot not found"));

            timeSlotRepository.delete(timeSlot);
            return ResponseEntity.ok("Time slot deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to delete time slot: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeSlotDTO> getTimeSlotById(@PathVariable Long id) {
        try {
            TimeSlot timeSlot = timeSlotRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("TimeSlot not found"));

            TimeSlotDTO dto = new TimeSlotDTO();
            dto.setTime(timeSlot.getTime());
            dto.setAvailable(timeSlot.isAvailable());

            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
