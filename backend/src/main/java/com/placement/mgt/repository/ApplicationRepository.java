package com.placement.mgt.repository;

import com.placement.mgt.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    List<Application> findByJobId(Long jobId);
    List<Application> findByJobCompanyId(Long companyId);
    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);
    Optional<Application> findByStudentIdAndJobId(Long studentId, Long jobId);

    // Dashboard Statistics Queries
    @Query("SELECT a.status as status, COUNT(a) as count FROM Application a GROUP BY a.status")
    List<Map<String, Object>> getApplicationStatusCounts();

    @Query("SELECT s.branch as branch, COUNT(a) as count FROM Application a JOIN a.student s WHERE a.status = 'SELECTED' GROUP BY s.branch")
    List<Map<String, Object>> getBranchWisePlacements();

    @Query("SELECT c.companyName as company, COUNT(a) as count FROM Application a JOIN a.job j JOIN j.company c WHERE a.status = 'SELECTED' GROUP BY c.companyName")
    List<Map<String, Object>> getCompanyWiseHires();

    @Query("SELECT MAX(j.packageAmount) as maxPackage, MIN(j.packageAmount) as minPackage, AVG(j.packageAmount) as avgPackage FROM Application a JOIN a.job j WHERE a.status = 'SELECTED'")
    Map<String, Object> getSelectedPackageStatistics();
    
    @Query("SELECT FUNCTION('MONTHNAME', a.appliedAt) as month, COUNT(a) as count FROM Application a WHERE a.status = 'SELECTED' GROUP BY FUNCTION('MONTH', a.appliedAt), FUNCTION('MONTHNAME', a.appliedAt) ORDER BY FUNCTION('MONTH', a.appliedAt)")
    List<Map<String, Object>> getMonthlyPlacementTrends();
}