package com.example.zipplz_be.Mypage.controller;

import com.example.zipplz_be.Global.dto.ResponseDTO;
import com.example.zipplz_be.Mypage.service.WishService;
import com.example.zipplz_be.Portfolio.dto.PortfolioViewDTO;
import com.example.zipplz_be.User.dto.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/wish")
public class WishController {

    private final WishService wishService;

    public WishController(WishService wishService) {
        this.wishService = wishService;
    }

    @PostMapping("/addWish")
    public ResponseEntity<ResponseDTO<Boolean>> addWish(Authentication authentication, @RequestBody(required = false) Map<String, Integer> params) {
        ResponseDTO<Boolean> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
            int user_serial = customUserDetails.getUserSerial();
            int wish_type = params.get("wish_type");
            int wish_serial = params.get("wish_serial");
            int result = wishService.addWish(user_serial, wish_type, wish_serial);
            if (result == 0) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "삽입 실패 없음");
            } else {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "삽입 성공", true);
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }

    @DeleteMapping("/deleteWish")
    public ResponseEntity<ResponseDTO<Boolean>> deleteWish(Authentication authentication, @RequestBody(required = false) Map<String, Integer> params) {
        ResponseDTO<Boolean> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            int wish_serial = params.get("wish_serial");
            int result = wishService.deleteWish(wish_serial);
            if (result == 0) {
                status = HttpStatus.BAD_REQUEST;
                responseDTO = new ResponseDTO<>(status.value(), "삭제 실패 없음");
            } else {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "삭제 성공", true);
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }

    @PostMapping("/workerlist")
    public ResponseEntity<ResponseDTO<List<PortfolioViewDTO>>> getWorkerWishList(Authentication authentication, @RequestBody(required = false) Map<String, Integer> params) {
        ResponseDTO<List<PortfolioViewDTO>> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
            int user_serial = customUserDetails.getUserSerial();
            int wish_type = 1;
            List<PortfolioViewDTO> workers = wishService.getWorkerWishList(wish_type, user_serial);
            if (workers == null) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "세션 결과 없음");
            } else {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "조회 성공", workers);
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }

    @PostMapping("/searchWish")
    public ResponseEntity<ResponseDTO<Integer>> searchWish(Authentication authentication, @RequestBody(required = false) Map<String, Integer> params) {
        ResponseDTO<Integer> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
            int user_serial = customUserDetails.getUserSerial();
            int wish_serial = params.get("wish_serial");
            int result = wishService.searchWish(user_serial, wish_serial);
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "조회 성공", result);
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }
}
