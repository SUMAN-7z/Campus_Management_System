package com.placement.mgt.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewDto {
    private Long id;
    private Long applicationId;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String jobTitle;
    private String companyName;
    private LocalDate date;
    private LocalTime time;
    private String mode;
    private String meetingLink;
    private String feedback;
    private String status;
}