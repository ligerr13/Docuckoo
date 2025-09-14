package com.example.docutrack.services;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.docutrack.types.entities.RefreshToken;
import com.example.docutrack.repository.RefreshTokenRepository;
import com.example.docutrack.repository.UserRepository;
import com.example.docutrack.types.exeption.TokenRefreshException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;

@Service
public class RefreshTokenService {
    @Value("${app.jwt.refresh-expiration-time}")
    private Long refreshTokenDurationMs;

    @Autowired(required = true)
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired(required = true)
    private UserRepository userRepository;

    @Autowired(required = true)
    private CookieService cookieService;

    public Optional<RefreshToken> findByToken(String token){
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken generateRefreshToken(UserDetails userDetails){
        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUser(
            userRepository.findByUserName(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
        );

        refreshToken.setExpiryDate(System.currentTimeMillis() + (refreshTokenDurationMs));

        String uuid = UUID.randomUUID().toString();
        refreshToken.setToken(uuid);

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate() < System.currentTimeMillis()) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token expired. Please login again.");
        }
        return token;
    }

    @Transactional
    public int deleteByUserId(Integer userId) {
        return refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
    }

    public void generateRefreshTokenCookie(HttpServletResponse httpServletResponse, String secretKey){
        cookieService.createCookie(httpServletResponse, "refreshToken", secretKey, refreshTokenDurationMs);
    }

    public void deleteRefreshTokenCookie(HttpServletResponse httpServletResponse){
        cookieService.deleteCookie(httpServletResponse, "refreshToken");
    }

    public String getRefreshTokenCookie(HttpServletRequest request){
        return  cookieService.getCookie(request, "refreshToken");
    }
}
