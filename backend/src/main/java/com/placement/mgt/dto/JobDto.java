package com.placement.mgt.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDto {
    private Long id;
    private Long companyId;
    private String companyName;
    private String title;
    private String description;
    private BigDecimal packageAmount;
    private String jobType;
    private String location;
    private String skillsRequired;
    private BigDecimal minCgpa;
    private Integer batchYear;
    private LocalDate deadline;
    private Boolean isApplied; // Optional flag for student views
}