package com.example.zipplz_be.JWT.filter;

import com.example.zipplz_be.JWT.util.JWTUtil;
import com.example.zipplz_be.User.dto.CustomUserDetails;
import com.example.zipplz_be.User.entity.User;
import com.example.zipplz_be.User.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private UserRepository userRepository;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.setFilterProcessesUrl("/users/login"); // 로그인 요청 URL 설정
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String email = request.getHeader("email"); // 우리는 username 대신 email로 검증
        String password = request.getHeader("password");

        // User 사용자 조회
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new AuthenticationException("User not found") {};
        }

        if (user.getDelYN() == 1) {
            throw new AuthenticationException("This account has been deleted") {};
        }

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, password, null);
        return authenticationManager.authenticate(authToken);
    }

    @Override
    public void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        String email = customUserDetails.getUsername();
        User user = userRepository.findByEmail(email);
        int userSerial = user.getUserSerial();
        String role = user.getRole();
        String name = user.getUserName();

        System.out.println("succesfulAuthentication => " + user.toString());

        String token = jwtUtil.createJwt(email, userSerial, role, name);

        System.out.println("!!!!!!!!!!!!!!!!!!!!!!token!!!!!!!!!! => " + token);
        System.out.println("!!!!!!!!!!!!!name from token!!!!!!!!!! => " + jwtUtil.getName(token));
        response.addHeader("Authorization", "Bearer " + token);
    }

    @Override
    public void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
        response.setStatus(401); // 로그인 실패 시 401 응답코드 반환
    }
}
