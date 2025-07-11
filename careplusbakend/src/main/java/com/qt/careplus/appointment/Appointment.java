package com.qt.careplus.appointment;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="appoiments")
public class Appointment {
    
    @Id
    @Column(name ="appoiment_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name ="appoiment_date", nullable = false)
    private LocalDate date;

    @Column(name ="appoiment_time", nullable = false)
    private String time;

    @Column(name ="patient_id",nullable = false)
    private Integer patientId;

    @Column(name ="doctor_id", nullable = false)
    private Integer docterId;
  
   
}
