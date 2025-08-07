package com.example.zipplz_be.Portfolio.controller;

import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.Global.dto.ResponseDTO;
import com.example.zipplz_be.Portfolio.dto.*;
import com.example.zipplz_be.Portfolio.exception.CustomerReviewException;
import com.example.zipplz_be.Portfolio.exception.PortfolioNotFoundException;
import com.example.zipplz_be.Portfolio.exception.UnauthorizedUserException;
import com.example.zipplz_be.Portfolio.service.PortfolioService;
import com.example.zipplz_be.Schedule.exception.S3Exception;
import com.example.zipplz_be.User.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/portfolio")
public class PortfolioController {
    private final PortfolioService portfolioService;

    PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    //시공자별 포트폴리오 목록 조회
    @GetMapping("/list/{userSerial}")
    public ResponseEntity<?> getPortfolioList(@PathVariable int userSerial) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            List<PortfolioListDTO> portfolioList = portfolioService.getPortfolioListService(userSerial);

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "조회 성공!", portfolioList);
        } catch (UserNotFoundException e) {
            status = HttpStatus.BAD_REQUEST;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //포트폴리오 상세조회
    @GetMapping("/{portfolioSerial}")
    public ResponseEntity<?> getPortfolioInfo(@PathVariable int portfolioSerial) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            PortfolioInfoDTO portfolioInfoDTO = portfolioService.getPortfolioInfoService(portfolioSerial);

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "조회 성공!", portfolioInfoDTO);
        } catch (PortfolioNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);

    }

    //시공자별 공종 일정 조회
    @GetMapping("/schedule/{workerSerial}")
    public ResponseEntity<?> getWorkerSchedule(@PathVariable int workerSerial) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            List<PortfolioWorkListDTO> portfolioWorkListDTOList = portfolioService.getWorkerScheduleService(workerSerial);

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "조회 성공!", portfolioWorkListDTOList);
        } catch (UserNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //시공자 일정 세부사항 조회
    @GetMapping("/schedule/{workerSerial}/view/{workSerial}")
    public ResponseEntity<?> getWorkerScheduleInfo(Authentication authentication, @PathVariable int workerSerial, @PathVariable int workSerial) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            PortfolioWorkDetailDTO portfolioWorkDetailDTO =
                    portfolioService.getWorkerScheduleInfoService(portfolioService.getUserSerial(authentication), workerSerial, workSerial);

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "조회 성공!", portfolioWorkDetailDTO);
        } catch (UnauthorizedUserException e) {
            status = HttpStatus.UNAUTHORIZED;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (UserNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //매너온도와 리뷰 평균, 리뷰 목록 조회하기(각 리뷰별 평균 별점도 리턴 필요)
    @GetMapping("/review/{portfolioSerial}")
    public ResponseEntity<?> getPortfolioReview(@PathVariable int portfolioSerial) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            PortfolioReviewDTO portfolioReviewDTO = portfolioService.getPortfolioReviewService(portfolioSerial);

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "조회 성공!", portfolioReviewDTO);
        } catch (PortfolioNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //사장님 댓글 작성하기
    @PostMapping("/review/{customerReviewSerial}/reviewcomment")
    public ResponseEntity<?> insertReviewComment(Authentication authentication, @PathVariable int customerReviewSerial, @RequestBody Map<String, Object> params) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            portfolioService.insertReviewCommentService(portfolioService.getUserSerial(authentication), customerReviewSerial, params);

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "작성 성공!");
        } catch (UnauthorizedUserException e) {
            status = HttpStatus.UNAUTHORIZED;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (CustomerReviewException e) {
            status = HttpStatus.BAD_REQUEST;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //포트폴리오 수정
    @PatchMapping("/{portfolioSerial}")
    public ResponseEntity<?> modifyPortfolio(Authentication authentication, @PathVariable int portfolioSerial, @RequestBody Map<String, Object> params) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            portfolioService.modifyPortfolioService(portfolioService.getUserSerial(authentication), portfolioSerial, params);

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "수정 성공!");
        } catch (PortfolioNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (UnauthorizedUserException e) {
            status = HttpStatus.UNAUTHORIZED;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //포트폴리오 삭제
    @DeleteMapping("/{portfolioSerial}")
    public ResponseEntity<?> deletePortfolio(Authentication authentication, @PathVariable int portfolioSerial) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            portfolioService.deletePortfolioService(portfolioService.getUserSerial(authentication), portfolioSerial);

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "삭제 성공!");
        } catch (PortfolioNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (UnauthorizedUserException e) {
            status = HttpStatus.UNAUTHORIZED;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //지피티로 프롬프트 보내서 요약
    @GetMapping("/review/{portfolioSerial}/chatgpt")
    public ResponseEntity<?> summarizeReview(@PathVariable int portfolioSerial) {
        //좋은리뷰, 나쁜리뷰 각각 가져와서 리턴
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            ReviewSummarizeDTO reviewSummarizeDTO = portfolioService.summarizeReviewService(portfolioSerial);

            status= HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "요약 성공!", reviewSummarizeDTO);
        } catch (RestClientException e) {
            status = HttpStatus.BAD_REQUEST;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);


    }

    //포트폴리오 이미지 넣기
    @PostMapping("{portfolioSerial}/image")
    public ResponseEntity<?> uploadPortfolioImage(Authentication authentication, @RequestPart MultipartFile image, @PathVariable int portfolioSerial) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            File file = portfolioService.uploadPortfolioImageService(portfolioService.getUserSerial(authentication), image, portfolioSerial);

            status= HttpStatus.CREATED;
            responseDTO = new ResponseDTO<>(status.value(), "업로드 성공!", file);
        } catch (UnauthorizedUserException e) {
            status = HttpStatus.UNAUTHORIZED;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (PortfolioNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (S3Exception e) {
            status = HttpStatus.BAD_REQUEST;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //포트폴리오에서 이미지 삭제
    @DeleteMapping("/{portfolioSerial}/image/{fileSerial}")
    public ResponseEntity<?> deletePortfolioImage(Authentication authentication, @PathVariable int portfolioSerial, @PathVariable int fileSerial) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {

            portfolioService.deletePortfolioImageService(portfolioService.getUserSerial(authentication), portfolioSerial, fileSerial);

            status= HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "삭제 성공!");
        } catch (UnauthorizedUserException e) {
            status = HttpStatus.UNAUTHORIZED;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }



}