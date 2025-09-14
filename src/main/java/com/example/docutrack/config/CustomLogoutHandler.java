package com.example.docutrack.config;

import com.example.docutrack.services.RefreshTokenService;
import com.example.docutrack.services.DocuTrackUserDetailsService;
import com.example.docutrack.types.entities.RefreshToken;
import com.example.docutrack.types.entities.User;
import com.example.docutrack.repository.RefreshTokenRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class CustomLogoutHandler implements LogoutHandler {

    @Autowired
    private RefreshTokenService refreshTokenService;
    
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        try {
            String refreshToken = refreshTokenService.getRefreshTokenCookie(request);

            if (refreshToken == null) {
                return;
            }

            Optional<RefreshToken> tokenOptional = refreshTokenRepository.findByToken(refreshToken);

            if (tokenOptional.isPresent()) {
                RefreshToken token = tokenOptional.get();
                Integer userId = token.getUser().getUserId();
                
                refreshTokenService.deleteByUserId(userId);
            }
        } catch (Exception e) {
            System.err.println("Logout failed: " + e.getMessage());
        }
        
        refreshTokenService.deleteRefreshTokenCookie(response);
    }
}
