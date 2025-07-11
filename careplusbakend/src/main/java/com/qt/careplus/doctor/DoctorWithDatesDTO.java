package com.qt.careplus.doctor;

import java.util.List;

import com.qt.careplus.doctor.doctordate.DoctorDateDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorWithDatesDTO {
    private DoctorDTO doctor;
    private List<DoctorDateDTO> availableDates;
}
