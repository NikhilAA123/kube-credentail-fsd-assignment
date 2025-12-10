package com.kubecredential.auth.dto;

import java.util.Map;

public class VerifyResponse {

    private boolean valid;
    private Map<String, Object> decoded;

    public VerifyResponse() {}

    public VerifyResponse(boolean valid, Map<String, Object> decoded) {
        this.valid = valid;
        this.decoded = decoded;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public Map<String, Object> getDecoded() {
        return decoded;
    }

    public void setDecoded(Map<String, Object> decoded) {
        this.decoded = decoded;
    }
}
