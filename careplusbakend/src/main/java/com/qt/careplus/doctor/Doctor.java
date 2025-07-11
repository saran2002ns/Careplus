package com.qt.careplus.doctor;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import com.qt.careplus.doctor.doctordate.DoctorDate;
import com.qt.careplus.specialist.Specialist;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_id")
    private Long id;

    @Column(name = "doctor_name", nullable = false)
    private String name;

    @Column(name = "doctor_age", nullable = false)
    private Byte age;

    @Column(name = "doctor_gender", nullable = false)
    private String gender;

    @Column(name = "doctor_number", nullable = false, unique = true)
    private String number;

    @ManyToOne
    @JoinColumn(name = "specialist_id", nullable = false)
    private Specialist specialist;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DoctorDate> availableDates;

     @Column(name = "doctor_address")
    private String address;

  
}
