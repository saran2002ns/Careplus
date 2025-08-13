package com.qt.careplus.admin;

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
@Table(name="admins")
public class Admin {

    @Id
    @Column(name ="admin_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Byte id;

    @Column(name ="admin_name", nullable = false)
    private String name;

    @Column(name ="admin_number",unique = true, nullable = false)
    private String number;

    @Column(name ="admin_password", nullable = false)
    private String password;
   

}
