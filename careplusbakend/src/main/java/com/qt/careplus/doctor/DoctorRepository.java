package com.qt.careplus.doctor;



import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;


@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    boolean existsByNumber(String number);

    Optional<Doctor> findById(Integer docterId);
     List<Doctor> findByNameContainingIgnoreCase(String name);

}

