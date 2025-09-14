package com.example.docutrack.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

// Claims: Claims are pieces of information stored within the JWT.

// A JWT has three main types of claims:

// Registered Claims: These are a set of predefined, non-mandatory claims like iss (issuer), sub (subject, usually the user ID or username), exp (expiration time), and iat (issued at).
// Public Claims: These are claims defined by those using JWTs, but they should be defined in the IANA JSON Web Token Registry to avoid collisions.
// Private Claims: These are custom claims created for the specific application, like a user's role or other application-specific data.

@Service
public class JwtService {
    @Value("${security.jwt.secret-key}") //This injects the secret key from the application's application.properties or userRepositoryapplication.yml file. This key is used to sign and verify the tokens.
    private String secretKey;
    
    @Value("${security.jwt.expiration-time}") //This injects the token's expiration time, also from the configuration file, making it easy to configure without changing the code.
    private long jwtExpiration;

    @Autowired(required = true)
    CookieService cookieService;
    
    // This method is responsible for taking the Base64-encoded secret key from your configuration and converting it into a SecretKey object that the JWT library can use.
    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
        
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts
            .parser()                           // Creates a parser.
            .verifyWith(getSignInKey())         // Sets the signing key for verification. This ensures the token's signature is valid and hasn't been tampered with.
            .build()                            // [ 
            .parseSignedClaims(token)           //  Parses the token and returns the claims.
            .getPayload();                      // ]
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    public void generateJwtCookie(HttpServletResponse httpServletResponse, String secretKey){
        cookieService.createCookie(httpServletResponse, "accessToken", secretKey, jwtExpiration);
    }

    public void deleteJwtCookie(HttpServletResponse httpServletResponse, String secretKey){
        cookieService.deleteCookie(httpServletResponse, secretKey);
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        return Jwts
            .builder()
            .claims().add(extraClaims)
            .and()
            .subject(userDetails.getUsername())
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSignInKey())
            .compact();
    }
}