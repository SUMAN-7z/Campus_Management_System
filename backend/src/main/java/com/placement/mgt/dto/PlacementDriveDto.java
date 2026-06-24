package com.placement.mgt.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlacementDriveDto {
    private Long id;
    private String driveName;
    private Long companyId;
    private String companyName;
    private LocalDate date;
    private LocalTime time;
    private String venue;
    private String eligibilityCriteria;
    private LocalDate registrationDeadline;
    private String status;
}