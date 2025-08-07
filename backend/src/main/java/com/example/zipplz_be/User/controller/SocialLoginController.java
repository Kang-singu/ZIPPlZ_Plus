package com.example.zipplz_be.User.controller;

import com.example.zipplz_be.Global.dto.ResponseDTO;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/users")
public class SocialLoginController {

    @GetMapping("/callback")
    public ResponseEntity<ResponseDTO> googleLogin(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            String token = getCookieValue(request);
            if (token.equals("Token not found")) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "소셜 로그인 후, 토큰 발급 실패");
            } else {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "소셜 로그인 후, 토큰 발급 성공");
                response.addHeader("Authorization", "Bearer " + token);
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }

    public String getCookieValue(HttpServletRequest request) {
        String tokenValue = null;

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    tokenValue = cookie.getValue();
                    break;
                }
            }
        }

        return tokenValue != null ? tokenValue : "Token not found";
    }

}
