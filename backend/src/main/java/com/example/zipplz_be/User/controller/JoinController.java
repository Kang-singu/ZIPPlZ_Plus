package com.example.zipplz_be.User.controller;

import com.example.zipplz_be.Global.dto.ResponseDTO;
import com.example.zipplz_be.JWT.util.JWTUtil;
import com.example.zipplz_be.User.dto.*;
import com.example.zipplz_be.User.service.JoinService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/users")
public class JoinController {

    private final JoinService joinService;
    private final JWTUtil jwtUtil;
    public JoinController(JoinService joinService, JWTUtil jwtUtil) {
        this.joinService = joinService;
        this.jwtUtil = jwtUtil;
    }

    @Getter
    public static class EmailRequest {
        private String email;
    }

    @PostMapping("/check-email")
    public ResponseEntity<ResponseDTO> isEmailAlreadyExist(@RequestBody EmailRequest email) {
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            boolean exists = joinService.isEmailAlreadyExist(email.getEmail());
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "이메일 중복 체크 완료", exists);
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    @PostMapping("/join")
    public ResponseEntity<ResponseDTO> joinProcess(@RequestBody JoinRequestDTO joinRequestDTO) {
        System.out.println("joinProcess 진입=======================================");
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            int userSerial = joinService.joinProcess(joinRequestDTO);
            if (userSerial == -1) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "유저 회원가입 실패.");
            } else {
                status = HttpStatus.OK;
                JoinResponseDTO joinResponseDTO = new JoinResponseDTO(userSerial);
                responseDTO = new ResponseDTO<>(status.value(), "유저 회원가입 성공", joinResponseDTO);
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }

    @PutMapping("/join/social")
    public ResponseEntity<ResponseDTO> joinAfterSocialProcess(HttpServletRequest request, @RequestBody JoinRequestDTO joinRequestDTO) {
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            String token = getCookieValue(request);
            String email = jwtUtil.getEmail(token);
            joinRequestDTO.setEmail(email);

            int userSerial = joinService.joinAfterSocialProcess(joinRequestDTO);
            if (userSerial == -1) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "소셜 로그인 후, 회원가입 실패");
            } else {
                status = HttpStatus.OK;
                JoinResponseDTO joinResponseDTO = new JoinResponseDTO(userSerial);
                responseDTO = new ResponseDTO<>(status.value(), "소셜 로그인 후, 회원가입 성공", joinResponseDTO);
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }

    @PostMapping("/join/customer")
    public ResponseEntity<ResponseDTO> insertCustomerInfo(@RequestBody InsertCustomerDTO insertCustomerDTO) {
        System.out.println("insertCustomerInfo 진입=======================================");
        ResponseDTO responseDTO;
        HttpStatus status;

        try {
            boolean result = joinService.insertCustomerInfo(insertCustomerDTO);
            if (!result) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "해당 유저를 찾을 수 없습니다.");
            } else {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "고객 세부사항 입력 성공");
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }

    @PostMapping("/join/worker")
    public ResponseEntity<ResponseDTO> insertWorkerInfo(@RequestBody InsertWorkerDTO insertWorkerDTO) {
        System.out.println("insertWorkerInfo 진입=======================================");
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            joinService.insertWorkerInfo(insertWorkerDTO);
//            if () {
//                status = HttpStatus.NOT_FOUND;
//                responseDTO = new ResponseDTO<>(status.value(), "해당 유저를 찾을 수 없습니다.");
//            } else {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "시공자 세부사항 입력 후, 포트폴리오 생성");
//            }
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
