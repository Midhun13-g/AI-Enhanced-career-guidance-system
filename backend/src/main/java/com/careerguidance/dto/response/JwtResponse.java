package com.careerguidance.dto.response;

import java.util.List;
import com.careerguidance.entity.AccountStatus;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private List<String> roles;
    private AccountStatus accountStatus;
    private String message;

    public JwtResponse(String token, Long id, String firstName, String lastName, String email, List<String> roles) {
        this.token = token;
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.roles = roles;
    }

    public String getToken() {
        return token;
    }

    public String getType() {
        return type;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public List<String> getRoles() {
        return roles;
    }
    public AccountStatus getAccountStatus() { return accountStatus; }
    public void setAccountStatus(AccountStatus accountStatus) { this.accountStatus = accountStatus; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
