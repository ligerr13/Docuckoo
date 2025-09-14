package com.example.docutrack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.docutrack.repository.UserRepository;


@Service
public class DocuTrackUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        return userRepository.findByUserEmail(userName)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + userName));
    }

    public UserDetails loadUserByUserName(String userName) throws UsernameNotFoundException{
        return userRepository.findByUserName(userName)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userName));
    }
} 