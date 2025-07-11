package com.qt.careplus.patient;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "patients") 
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Long id;

    @Column(name = "patient_name", nullable = false)
    private String name;

    @Column(name = "patient_number", nullable = false, unique = true)
    private String number;

    @Column(name = "patient_date", nullable = false)
    private LocalDate date;

    @Column(name = "patient_time", nullable = false)
    private String time;

    @Column(name = "patient_age", nullable = false)
    private byte age;

    @Column(name = "patient_gender", nullable = false)
    private String gender;

    @Column(name = "patient_address", nullable = false)
    private String address;

    @Column(name = "is_allocated", nullable = false)
    private boolean isAllocated;
}
