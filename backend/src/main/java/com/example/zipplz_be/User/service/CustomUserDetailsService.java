package com.example.zipplz_be.User.service;

import com.example.zipplz_be.User.dto.CustomUserDetails;
import com.example.zipplz_be.User.entity.User;
import com.example.zipplz_be.User.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        if (!userRepository.existsByEmail(email)) {
            throw new UsernameNotFoundException("해당 유저를 찾을 수 없습니다.");
        }

        User userData = userRepository.findByEmail(email);
        return new CustomUserDetails(userData);
    }
}
