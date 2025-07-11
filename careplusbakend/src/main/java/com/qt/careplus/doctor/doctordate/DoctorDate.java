package com.qt.careplus.doctor.doctordate;

import java.sql.Date;
import java.util.List;
import lombok.Data;
import com.qt.careplus.doctor.Doctor;
import com.qt.careplus.doctor.doctortime.TimeSlot;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "doctor_dates")
public class DoctorDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "is_available", nullable = false)
    private boolean available;
    
    @Temporal(TemporalType.DATE) 
    @Column(name = "date", nullable = false)
    private Date date;

   @OneToMany(mappedBy = "doctorDate", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<TimeSlot> timeSlots;

   


}
