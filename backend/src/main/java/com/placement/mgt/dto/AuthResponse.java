package com.placement.mgt.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private Long userId;
    private String email;
    private String role;
    private String name;
    private Boolean isProfileCompleted;
    private Boolean isApproved;
    private Long companyId; // Null if not recruiter
}