package com.qt.careplus.specialist;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "specialists")
public class Specialist {

    @Id
    @Column(name = "specialist_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Byte specialistId;

    @Column(name = "specialist_name", nullable = false)
    private String name;
}
