package com.kubecredential.auth.service;

import com.kubecredential.auth.config.AuthProperties;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Duration;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    private final AuthProperties authProperties;
    private final Key key;

    public JwtService(AuthProperties authProperties) {
        this.authProperties = authProperties;
        // Use JWT_SECRET from config to build HMAC key
        this.key = Keys.hmacShaKeyFor(authProperties.getJwtSecret().getBytes(StandardCharsets.UTF_8));
    }

    // Parse "1h", "30m", "3600s" style to milliseconds
    private long resolveExpiryMillis() {
        String cfg = authProperties.getTokenExpiresIn();
        if (cfg == null || cfg.isBlank()) {
            cfg = "1h";
        }

        cfg = cfg.trim().toLowerCase();
        long seconds;
        if (cfg.endsWith("h")) {
            long hours = Long.parseLong(cfg.substring(0, cfg.length() - 1));
            seconds = Duration.ofHours(hours).getSeconds();
        } else if (cfg.endsWith("m")) {
            long minutes = Long.parseLong(cfg.substring(0, cfg.length() - 1));
            seconds = Duration.ofMinutes(minutes).getSeconds();
        } else if (cfg.endsWith("s")) {
            long s = Long.parseLong(cfg.substring(0, cfg.length() - 1));
            seconds = s;
        } else {
            // fallback assume seconds
            seconds = Long.parseLong(cfg);
        }
        return seconds * 1000L;
    }

    public String generateToken(String userId, String email) {
        long now = System.currentTimeMillis();
        long expiresInMillis = resolveExpiryMillis();

        return Jwts.builder()
                .setSubject(userId)
                .claim("email", email)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expiresInMillis))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Map<String, Object> verifyToken(String token) {
        Jws<Claims> jws = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);

        Claims claims = jws.getBody();
        Map<String, Object> result = new HashMap<>(claims);
        result.put("sub", claims.getSubject());
        return result;
    }
}
