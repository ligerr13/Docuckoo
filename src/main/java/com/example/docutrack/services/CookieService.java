package com.example.docutrack.services;

import org.springframework.http.ResponseCookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public class CookieService {

    public void createCookie(HttpServletResponse response, String key, String value, long maxAgeTimeMillis) {
        ResponseCookie cookie = ResponseCookie.from(key, value)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge((int) (maxAgeTimeMillis / 1000))
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

    public void deleteCookie(HttpServletResponse response, String key) {
        ResponseCookie cookie = ResponseCookie.from(key, "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

    public String getCookie(HttpServletRequest request, String key) {
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals(key)) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
