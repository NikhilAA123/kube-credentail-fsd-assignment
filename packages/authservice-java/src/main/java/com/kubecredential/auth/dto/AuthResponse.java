package com.kubecredential.auth.dto;

public class AuthResponse {

    private boolean success;
    private UserResponse user;
    private String token;

    public AuthResponse() {}

    public AuthResponse(boolean success, UserResponse user, String token) {
        this.success = success;
        this.user = user;
        this.token = token;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
