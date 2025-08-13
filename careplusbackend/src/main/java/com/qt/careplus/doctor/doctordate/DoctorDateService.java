package com.qt.careplus.doctor.doctordate;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qt.careplus.doctor.doctortime.TimeSlotDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoctorDateService {

    private final DoctorDateRepository doctorDateRepository;

    public List<DoctorDateDTO> getDatesForDoctor(Long doctorId) {
        List<DoctorDate> dates = doctorDateRepository.findDatesWithTimeSlots(doctorId);

        return dates.stream().map(date -> {
            DoctorDateDTO dto = new DoctorDateDTO();
            dto.setDateId(date.getId());
            dto.setAvailable(date.isAvailable());
            dto.setDate(date.getDate());
           

            List<TimeSlotDTO> slots = date.getTimeSlots().stream()
                .map(slot -> new TimeSlotDTO(slot.getTime(), slot.isAvailable()))
                .toList();

            dto.setTimeSlots(slots);
            return dto;
        }).toList();
    }
}

