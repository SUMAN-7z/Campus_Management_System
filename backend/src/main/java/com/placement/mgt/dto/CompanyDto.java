package com.placement.mgt.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDto {
    private Long id;
    private String companyName;
    private String industry;
    private String hrName;
    private String email;
    private String phone;
    private String website;
    private String address;
    private String description;
    private Boolean isApproved;
}