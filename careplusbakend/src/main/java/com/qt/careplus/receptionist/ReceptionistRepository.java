package com.qt.careplus.receptionist;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceptionistRepository extends JpaRepository<Receptionist, Integer> {

    Receptionist findByNumber(String identifier);
    List<Receptionist> findByNameContainingIgnoreCase(String name);
    boolean existsByNumber(String number);

}
