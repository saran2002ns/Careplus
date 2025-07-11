package com.qt.careplus.receptionist;



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
@Table(name="receptionists")
public class Receptionist {
    @Id
    @Column(name ="receptionist_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name ="receptionist_name", nullable = false)
    private String name;

    @Column(name ="receptionist_number",unique = true, nullable = false)
    private String number;

    @Column(name ="receptionist_password", nullable = false)
    private String password;
   
    
}
