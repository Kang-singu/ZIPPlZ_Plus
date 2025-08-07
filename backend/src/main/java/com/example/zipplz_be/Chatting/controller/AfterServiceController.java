package com.example.zipplz_be.Chatting.controller;

import com.example.zipplz_be.Chatting.entity.AfterService;
import com.example.zipplz_be.Chatting.service.AfterServiceService;
import com.example.zipplz_be.Global.dto.ResponseDTO;
import com.example.zipplz_be.Portfolio.exception.UnauthorizedUserException;
import com.example.zipplz_be.Portfolio.service.PortfolioService;
import com.example.zipplz_be.Schedule.exception.WorkException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/afterservice")
public class AfterServiceController {
    private final AfterServiceService afterServiceService;
    private final PortfolioService portfolioService;

    AfterServiceController(PortfolioService portfolioService, AfterServiceService afterServiceService) {
        this.portfolioService = portfolioService;
        this.afterServiceService = afterServiceService;
    }

    //a/s 내역 불러오기
    @GetMapping("/{chatroomSerial}")
    public ResponseEntity<?> getAfterServiceList(@PathVariable int chatroomSerial, @RequestParam Map<String, Object> params) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            //공종 번호가 유효한지 검사 후 해당 공종 번호와 일치하는 객체들을 불러옴.
            List<AfterService> afterServiceList = afterServiceService.getAfterServiceListService(chatroomSerial, params);

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "조회 성공!", afterServiceList);
        } catch (WorkException e) {
            status = HttpStatus.BAD_REQUEST;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //고객이 채팅방에서 a/s요청(끝난지 n년 이하일 때만 요청 가능)
    @PostMapping("/{chatroomSerial}")
    public ResponseEntity<?> afterServiceRequest(Authentication authentication, @PathVariable int chatroomSerial, @RequestBody Map<String, Object> params) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            afterServiceService.afterServiceRequestService(portfolioService.getUserSerial(authentication), chatroomSerial, params);

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "요청 성공!");
        } catch (UnauthorizedUserException e) {
            status = HttpStatus.UNAUTHORIZED;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (WorkException e) {
            status = HttpStatus.BAD_REQUEST;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //a/s 평가하기(별점) -> 뱃지 쪽 점수에 반영(a/s 조회에서 완료하기(평가하기) 가능)
    @PostMapping("/review/{afterServiceSerial}")
    public ResponseEntity<?> afterServiceReview(@PathVariable int afterServiceSerial, @RequestBody Map<String, Object> params) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            afterServiceService.afterServiceReviewService(afterServiceSerial, params);

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "평가 반영 성공!");
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);

    }
}