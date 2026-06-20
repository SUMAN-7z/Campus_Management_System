package com.placement.mgt.repository;

import com.placement.mgt.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    List<Student> findByIsVerified(Boolean isVerified);
    List<Student> findByBranch(String branch);
}