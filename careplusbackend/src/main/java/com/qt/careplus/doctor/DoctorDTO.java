package com.qt.careplus.doctor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDTO {
    private Long doctorId;
    private Byte age;
    private String gender;
    private String name;
    private String number;
    private Byte specialistId;
    private String specialist;
    private String address;
}




