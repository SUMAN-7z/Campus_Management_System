package com.placement.mgt.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private String studentBranch;
    private java.math.BigDecimal studentCgpa;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String status;
    private String resumePath;
    private LocalDateTime appliedAt;
    private String remarks;
}