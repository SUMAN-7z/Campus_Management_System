package com.placement.mgt.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
    private Long totalStudents;
    private Long totalRecruiters;
    private Long totalCompanies;
    private Long totalJobs;
    private Long totalApplications;
    private Double placementPercentage;
    
    // Package stats
    private java.math.BigDecimal maxPackage;
    private java.math.BigDecimal minPackage;
    private java.math.BigDecimal avgPackage;

    // Chart Data
    private List<Map<String, Object>> branchWisePlacement;
    private List<Map<String, Object>> companyWiseHiring;
    private List<Map<String, Object>> monthlyPlacementTrend;
}