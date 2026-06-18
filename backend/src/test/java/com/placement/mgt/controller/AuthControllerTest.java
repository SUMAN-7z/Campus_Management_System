package com.placement.mgt.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.placement.mgt.config.JwtService;
import com.placement.mgt.dto.AuthResponse;
import com.placement.mgt.dto.LoginRequest;
import com.placement.mgt.dto.RegisterRequest;
import com.placement.mgt.service.AuthService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for targeted unit testing
@ContextConfiguration(classes = AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private AuthenticationManager authenticationManager;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void shouldReturnBadRequestWhenRegistrationEmailIsInvalid() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("invalid-email")
                .password("validPassword1")
                .role("STUDENT")
                .name("John Doe")
                .phone("9876543210")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturnBadRequestWhenRegistrationRoleIsInvalid() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("test@placement.com")
                .password("validPassword1")
                .role("INVALID_ROLE")
                .name("John Doe")
                .phone("9876543210")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldAuthenticateUserSuccessfullyOnLogin() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("student@placement.com")
                .password("student123")
                .build();

        AuthResponse mockResponse = AuthResponse.builder()
                .accessToken("mock-access-token")
                .refreshToken("mock-refresh-token")
                .email("student@placement.com")
                .role("ROLE_STUDENT")
                .build();

        Mockito.when(authService.login(Mockito.any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("mock-access-token"))
                .andExpect(jsonPath("$.refreshToken").value("mock-refresh-token"))
                .andExpect(jsonPath("$.role").value("ROLE_STUDENT"));
    }
}
