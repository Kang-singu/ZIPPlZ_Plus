package com.example.zipplz_be.Mypage.controller;

import com.example.zipplz_be.Board.dto.FindWorkerListDTO;
import com.example.zipplz_be.Board.dto.QuestionListDTO;
import com.example.zipplz_be.Board.dto.ShowBoardListDTO;
import com.example.zipplz_be.Global.dto.ResponseDTO;
import com.example.zipplz_be.Mypage.dto.LocalResponseDTO;
import com.example.zipplz_be.Mypage.dto.MyPageResponseDTO;
import com.example.zipplz_be.Mypage.dto.UpdateCustomerDTO;
import com.example.zipplz_be.Mypage.dto.UpdateWorkerDTO;
import com.example.zipplz_be.Mypage.service.MyPageService;
import com.example.zipplz_be.Portfolio.dto.PortfolioViewDTO;
import com.example.zipplz_be.User.dto.CustomUserDetails;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/mypage")
@RestController
public class MyPageController {

    private final MyPageService myPageService;

    @Getter
    public static class PasswordRequest {
        private String password;
    }

    @GetMapping("")
    public ResponseEntity<ResponseDTO> getMyPage(Authentication authentication) {
        ResponseDTO responseDTO;
        HttpStatus status;

        try {
            MyPageResponseDTO myPage = myPageService.getMyPage(this.getUserSerial(authentication), this.getUserRole(authentication));
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "마이페이지 조회 성공", myPage);
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    @PostMapping("/update-customer")
    public ResponseEntity<ResponseDTO> updateCustomer(Authentication authentication, @RequestBody UpdateCustomerDTO updateCustomerDTO) {

        ResponseDTO responseDTO;
        HttpStatus status;

        try {
            int userSerial = getUserSerial(authentication);
            updateCustomerDTO.setUserSerial(userSerial);
            boolean result = myPageService.updateCustomer(updateCustomerDTO);
            if (!result) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "고객 정보 업데이트 실패");
            } else {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "고객 정보 업데이트 성공");
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    @PostMapping("/update-worker")
    public ResponseEntity<ResponseDTO> updateWorker(Authentication authentication, @RequestBody UpdateWorkerDTO updateWorkerDTO) {

        ResponseDTO responseDTO;
        HttpStatus status;

        try {
            int userSerial = getUserSerial(authentication);
            updateWorkerDTO.setUserSerial(userSerial);
            boolean result = myPageService.updateWorker(updateWorkerDTO);
            if (!result) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "시공자 정보 업데이트 실패");
            } else {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "시공자 정보 업데이트 성공");
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    @PostMapping("/change-pw")
    public ResponseEntity<ResponseDTO> changePassword(Authentication authentication, @RequestBody PasswordRequest passwordRequest) {
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            int userSerial = getUserSerial(authentication);
            boolean result = myPageService.changePassword(userSerial, passwordRequest.getPassword());
            if (!result) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "비밀번호 변경 실패");
            } else {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "비밀번호 변경 성공");
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    @PostMapping("/profile-img")
    public ResponseEntity<ResponseDTO> setProfileImg(Authentication authentication, @RequestPart MultipartFile image) {
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            myPageService.setProfileImg(this.getUserSerial(authentication), image);
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "프로필 이미지 변경 성공");
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    @DeleteMapping("/profile-img")
    public ResponseEntity<ResponseDTO> deleteProfileImg(Authentication authentication) {
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            myPageService.deleteProfileImg(this.getUserSerial(authentication));
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "프로필 이미지 삭제 성공");
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    // 시공자 활동지역 조회
    @GetMapping("/worker/locations")
    public ResponseEntity<ResponseDTO> getWorkerLocations(Authentication authentication) {
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            if (!this.getUserRole(authentication).equals("worker")) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "이 유저는 시공자가 아닙니다.");
            } else {
                List<LocalResponseDTO> locations = myPageService.getWorkerLocations(this.getUserSerial(authentication));
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "시공자 활동지역 조회 성공", locations);
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    // 내가 쓴 질문글
    @GetMapping("/questions")
    public ResponseEntity<ResponseDTO> getMyQuestions(Authentication authentication) {
        ResponseDTO responseDTO;
        HttpStatus status;

        try {
            List<QuestionListDTO> questions = myPageService.getMyQuestions(this.getUserSerial(authentication));
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "내가 쓴 질문 목록 조회 성공", questions);
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    // 내가 쓴 자랑글
    @GetMapping("/showboards")
    public ResponseEntity<ResponseDTO> getMyShowBoards(Authentication authentication) {
        ResponseDTO responseDTO;
        HttpStatus status;

        try {
            List<ShowBoardListDTO> showBoards = myPageService.getMyShowBoards(this.getUserSerial(authentication));
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "내가 쓴 자랑글 목록 조회 성공", showBoards);
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    // 내가 쓴 구인구직글
    @GetMapping("/findworkers")
    public ResponseEntity<ResponseDTO> getMyFindWorkers(Authentication authentication) {
        ResponseDTO responseDTO;
        HttpStatus status;

        try {
            List<FindWorkerListDTO> findWorkers = myPageService.getMyFindWorkers(this.getUserSerial(authentication));
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "내가 쓴 구인구직글 조회 성공", findWorkers);
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    // 찜한 시공업자 목록 조회
    @GetMapping("/wish/workers")
    public ResponseEntity<ResponseDTO> getWisedhWorkers(Authentication authentication) {
        System.out.println("!!!!!!!!!111");
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            List<PortfolioViewDTO> wishWorkerList = myPageService.getWishedWorkers(this.getUserSerial(authentication));
            if (!this.getUserRole(authentication).equals("customer")) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "이 유저는 고객이 아닙니다.");
            } else {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "찜한 시공자 목록 조회 성공", wishWorkerList);
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    // 찜한 질문 글
    @GetMapping("/wish/questions")
    public ResponseEntity<ResponseDTO> getWishedQuestions(Authentication authentication) {
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            List<QuestionListDTO> questions = myPageService.getWishedQuestions(this.getUserSerial(authentication));
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "찜한 질문글 목록 조회 성공", questions);
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    // 찜한 자랑 글
    @GetMapping("/wish/showboards")
    public ResponseEntity<ResponseDTO> getWishedShowBoards(Authentication authentication) {
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            List<ShowBoardListDTO> showBoards = myPageService.getWishedShowBoards(this.getUserSerial(authentication));
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "찜한 자랑글 목록 조회 성공", showBoards);
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    // 찜한 구인구직 글
    @GetMapping("/wish/findworkers")
    public ResponseEntity<ResponseDTO> getWishedFindWorkers(Authentication authentication) {
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            List<FindWorkerListDTO> findWorkers = myPageService.getWishedFindWorkers(this.getUserSerial(authentication));
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "찜한 구인구직글 목록 조회 성공", findWorkers);
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    // 회원 탈퇴
    @DeleteMapping("/delete")
    public ResponseEntity<ResponseDTO> deleteAccount(Authentication authentication) {
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            myPageService.deleteAccount(this.getUserSerial(authentication));
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "회원 탈퇴 완료");
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    public int getUserSerial(Authentication authentication) {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        return customUserDetails.getUserSerial();
    }

    public String getUserRole(Authentication authentication) {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        return customUserDetails.getRole();
    }


}

