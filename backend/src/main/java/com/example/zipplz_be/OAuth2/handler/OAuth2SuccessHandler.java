package com.example.zipplz_be.OAuth2.handler;

import com.example.zipplz_be.JWT.util.JWTUtil;
import com.example.zipplz_be.User.dto.CustomOAuth2User;
import com.example.zipplz_be.User.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;
    private static final String REDIRECT_URI_NEW_USER = "http://localhost:5173/member/join/common/1/extra-agree";
    private static final String REDIRECT_URI_EXISTING_USER = "http://localhost:5173/";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        // 1. OAuth2User 가져오기
        CustomOAuth2User customOAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        boolean isNewUser = customOAuth2User.isNewUser();
        int userSerial = customOAuth2User.getUserSerial();
        String email = customOAuth2User.getUsername();

        // 2-1. 만약 아직 회원가입을 하지 않은 유저라면
        if (isNewUser) {
            String token = jwtUtil.createJwt(email, userSerial, "", "");
            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true);
//            emailCookie.setSecure(true); // HTTPS 환경에서만 쿠키가 전송
            cookie.setPath("/");
            response.addCookie(cookie); // 예시로 쿠키 사용
            response.sendRedirect("https://zipplz.site/member/join/common/1/extra-agree");

            System.out.println("social before join!!!!!!!!!!!!!!!!!!!token!!!!!!!!!! => " + token);
            System.out.println("social before join!!!!!!!!!!!!!name from token!!!!!!!!!! => " + jwtUtil.getName(token));
            return;
        }

        // 2-2. 이미 회원가입 한 유저라면,
        String role = customOAuth2User.getRole();
        String name = customOAuth2User.getUserName();
        String token = jwtUtil.createJwt(email, userSerial, role, name);
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie); // 예시로 쿠키 사용


        System.out.println("social after join!!!!!!!!!!!!!!!!!!!!!!token!!!!!!!!!! => " + token);
        System.out.println("social after join!!!!!!!!!!!!!name from token!!!!!!!!!! => " + jwtUtil.getName(token));
        response.sendRedirect("https://zipplz.site/success");
    }
}
