package com.kubecredential.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "auth")
public class AuthProperties {

    private String jwtSecret;
    private String tokenExpiresIn;
    private int saltRounds;
    private String dataDir;

    public String getJwtSecret() {
        return jwtSecret;
    }

    public void setJwtSecret(String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    public String getTokenExpiresIn() {
        return tokenExpiresIn;
    }

    public void setTokenExpiresIn(String tokenExpiresIn) {
        this.tokenExpiresIn = tokenExpiresIn;
    }

    public int getSaltRounds() {
        return saltRounds;
    }

    public void setSaltRounds(int saltRounds) {
        this.saltRounds = saltRounds;
    }

    public String getDataDir() {
        return dataDir;
    }

    public void setDataDir(String dataDir) {
        this.dataDir = dataDir;
    }
}
