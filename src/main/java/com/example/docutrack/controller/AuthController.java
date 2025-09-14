package com.example.docutrack.controller;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.docutrack.repository.RoleRepository;
import com.example.docutrack.repository.UserRepository;
import com.example.docutrack.services.AuthService;
import com.example.docutrack.services.CookieService;
import com.example.docutrack.services.DocuTrackUserDetailsService;
import com.example.docutrack.services.JwtService;
import com.example.docutrack.services.RefreshTokenService;
import com.example.docutrack.types.dtos.AuthResponseDTO;
import com.example.docutrack.types.dtos.RefreshTokenResponseDTO;
import com.example.docutrack.types.entities.RefreshToken;
import com.example.docutrack.types.entities.Role;
import com.example.docutrack.types.entities.User;
import com.example.docutrack.types.enums.ERole;
import com.example.docutrack.types.exeption.TokenRefreshException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired(required = true)
    private JwtService jwtService; 

    @Autowired(required = true)
    private AuthenticationManager authenticationManager;

    @Autowired(required = true)
    private UserRepository userRepository;

    @Autowired(required = true)
    private RoleRepository roleRepository;

    @Autowired(required = true)
    private PasswordEncoder passwordEncoder;

    @Autowired(required = true)
    private RefreshTokenService refreshTokenService;

    @Autowired(required = true)
    private DocuTrackUserDetailsService userDetailsService;

    @Autowired(required = true)
    AuthService authService;

    @Autowired(required = true)
    CookieService cookieService;

    @PostMapping("/signin")
    public ResponseEntity<AuthResponseDTO> authenticateUser(
            @Valid @RequestBody SignInRequest loginRequest,
            HttpServletResponse response
    ){
        try {
            Authentication auth = authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUserEmail(), 
                    loginRequest.getUserPassword()
                )

            );

            SecurityContextHolder.getContext().setAuthentication(auth);
            UserDetails userDetails = (UserDetails) auth.getPrincipal();

            String jwt = jwtService.generateToken(userDetails);
            RefreshToken refreshToken = refreshTokenService.generateRefreshToken(userDetails);
            
            jwtService.generateJwtCookie(response, jwt);
            refreshTokenService.generateRefreshTokenCookie(response, refreshToken.getToken());

            AuthResponseDTO responseDTO = new AuthResponseDTO(
                jwt, 
                refreshToken.getToken(),
                "Bearer "
            );

            return ResponseEntity.ok(responseDTO);

        } catch (Exception e) {
                throw new BadCredentialsException("Invalid email/password supplied");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registeUser(@Valid @RequestBody SignUpRequest signUpRequest){        
        if (userRepository.existsByUserName(signUpRequest.getUserName())) {
            return ResponseEntity
                .badRequest()
                .body("Error: Username is already taken!");
            }

        if (userRepository.existsByUserEmail(signUpRequest.getUserEmail())){
            return ResponseEntity
                .badRequest()
                .body("Error: This email is already taken!");
        }

        User newUser = new User(
            signUpRequest.getUserName(), 
            signUpRequest.getUserEmail(), 
            passwordEncoder.encode(signUpRequest.getUserPassword())
        );

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } 
        else 
        {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                    }
            });
        }

        newUser.setRoles(roles);
        userRepository.save(newUser);

        return ResponseEntity.ok("Success: User registration was successfull!");
    }

    // @PostMapping("/signout")
    // public ResponseEntity<?> logoutUser(
    //     HttpServletRequest request,
    //     HttpServletResponse response
    //     ) {
    //     User currentUser = authService.getCurrentUser();
    //     Integer userId = currentUser.getUserId();
        
    //     refreshTokenService.deleteRefreshTokenCookie(response);
    //     refreshTokenService.deleteByUserId(userId);

    //     return ResponseEntity.ok("Log out successful!");
    // }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshtoken(
        @Valid @RequestBody TokenRefreshRequest request,
        HttpServletResponse response
    ){
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
        .map(refreshTokenService::verifyExpiration)
        .map(RefreshToken::getUser)
        .map(user -> {
                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUserEmail());
                String jwt = jwtService.generateToken(userDetails);

                jwtService.generateJwtCookie(response, jwt);

                return ResponseEntity.ok(new RefreshTokenResponseDTO(jwt, requestRefreshToken));
            }
        ).orElseThrow(() -> new TokenRefreshException(
            requestRefreshToken, "Refresh token not found in database!"));
    }

}
 