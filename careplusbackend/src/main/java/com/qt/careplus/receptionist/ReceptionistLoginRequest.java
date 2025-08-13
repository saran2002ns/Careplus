package com.qt.careplus.receptionist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReceptionistLoginRequest {
    private String identifier; 
    private String password;
}
