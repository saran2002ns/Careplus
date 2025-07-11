package com.qt.careplus.doctor.doctordate;


import java.sql.Date;

import java.util.List;
import com.qt.careplus.doctor.doctortime.TimeSlotDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDateDTO {
    private Long dateId;
    private Long doctorId;
    private boolean available;
    private Date date;
   
    private List<TimeSlotDTO> timeSlots;
}
