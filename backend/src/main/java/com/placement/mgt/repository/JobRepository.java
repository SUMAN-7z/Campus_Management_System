package com.placement.mgt.repository;

import com.placement.mgt.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCompanyId(Long companyId);
    
    @Query("SELECT j FROM Job j WHERE j.minCgpa <= :cgpa AND j.batchYear = :batchYear AND j.deadline >= CURRENT_DATE")
    List<Job> findEligibleJobs(@Param("cgpa") BigDecimal cgpa, @Param("batchYear") Integer batchYear);

    List<Job> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCaseOrSkillsRequiredContainingIgnoreCase(
        String title, String location, String skills
    );
}