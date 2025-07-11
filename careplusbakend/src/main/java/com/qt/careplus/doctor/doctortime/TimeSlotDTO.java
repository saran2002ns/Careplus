package com.qt.careplus.doctor.doctortime;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotDTO {
    private String time;
    private boolean available;
    
}

