package com.example.zipplz_be.Schedule.controller;

import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.Global.dto.ResponseDTO;
import com.example.zipplz_be.Portfolio.entity.CustomerReview;
import com.example.zipplz_be.Portfolio.exception.UnauthorizedUserException;
import com.example.zipplz_be.Portfolio.service.PortfolioService;
import com.example.zipplz_be.Schedule.dto.PlanDetailDTO;
import com.example.zipplz_be.Schedule.dto.TodayWorkListDTO;
import com.example.zipplz_be.Schedule.dto.WorkListDTO;
import com.example.zipplz_be.Schedule.entity.Plan;
import com.example.zipplz_be.Schedule.entity.Work;
import com.example.zipplz_be.Schedule.exception.*;
import com.example.zipplz_be.Schedule.service.PlanService;
import com.example.zipplz_be.Schedule.service.WorkService;
import com.example.zipplz_be.User.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/schedule")
public class ScheduleController {
    private final PlanService planService;
    private final WorkService workService;
    private final PortfolioService portfolioService;

    public ScheduleController(PortfolioService portfolioService, PlanService planService, WorkService workService) {
        this.portfolioService = portfolioService;
        this.planService = planService;
        this.workService = workService;
    }

    //계획 목록 조회
    @GetMapping("/plans")
    public ResponseEntity<ResponseDTO<?>> getPlan(Authentication authentication) {
        //plan 테이블에서 현재 로그인한 유저의 계획 정보들 모두 가져오기
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            List<Plan> planList = planService.getPlanService(portfolioService.getUserSerial(authentication));

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "조회 성공", planList);
        } catch (CustomerNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //계획 상세조회
    @GetMapping("/plans/{planSerial}")
    public ResponseEntity<ResponseDTO<?>> getPlanDetail(Authentication authentication, @PathVariable int planSerial) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            PlanDetailDTO planDetailDTO = planService.getPlanDetailService(portfolioService.getUserSerial(authentication), planSerial);

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "조회 성공", planDetailDTO);
        } catch(PlanNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (CustomerNotFoundException e) {
            status = HttpStatus.UNAUTHORIZED;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //공종 추가
    @PostMapping("/plans/{planSerial}/works")
    public ResponseEntity<ResponseDTO<?>> insertWork(@PathVariable("planSerial") int planSerial, @RequestBody Map<String, Object> params) {
        //이름 검색해보고 없으면 0으로 넣고, 있으면 field_code 설정해주면 됨
        //worker serial이 없으면 빈 시공 띄우면 됨!

        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            workService.insertWorkService(planSerial, params);

            status = HttpStatus.CREATED;
            responseDTO = new ResponseDTO<>(status.value(), "삽입 성공");
        } catch(PlanNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(DuplicateFieldException e) {
            status = HttpStatus.BAD_REQUEST;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }


    //공종 목록 조회(페이징)
    @GetMapping("/plans/{planSerial}/works")
    public ResponseEntity<ResponseDTO<?>> getWorkList(@PathVariable("planSerial") int planSerial, @RequestParam Map<String, Object> params) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            //공종 테이블에서 해당 planSerial과 일치하는 목록들을 모두 가져오고, 페이징 처리.
            List<Work> workList = workService.getWorkListService(planSerial, params);
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(),"조회 성공", workList);
        } catch(PlanNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //유저별 공종 목록 조회
    @GetMapping("/users/works")
    public ResponseEntity<ResponseDTO<?>> getUsersWorkList(Authentication authentication) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            int userSerial =  portfolioService.getUserSerial(authentication);
            List<WorkListDTO> workList = planService.getUsersWorkListService(userSerial);

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(),"조회 성공", workList);
        } catch(UserNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }


        return new ResponseEntity<>(responseDTO, status);
    }

    //유저별 시공 중인 공종 조회
    @GetMapping("users/working")
    public ResponseEntity<?> getWorkingWork(Authentication authentication) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            List<TodayWorkListDTO> todayWorkList= planService.getWorkingWorkService(portfolioService.getUserSerial(authentication));

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(),"조회 성공", todayWorkList);
        } catch(UserNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }  catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //계획 추가
    @PostMapping("/plans")
    public ResponseEntity<ResponseDTO<?>> insertPlan(Authentication authentication, @RequestBody Map<String, Object> params) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            int userSerial = portfolioService.getUserSerial(authentication);

            planService.insertPlanService(userSerial, params);

            status = HttpStatus.CREATED;
            responseDTO = new ResponseDTO<>(status.value(), "추가 성공");
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //총 견적 조회
    @GetMapping("/plans/{planSerial}/price")
    public ResponseEntity<ResponseDTO<?>> getTotalPrice(@PathVariable int planSerial) {
        //해당 planSerial과 일치하는 공종들의 work_price 총합을 return한다!
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            Integer totalPrice = workService.getTotalPriceService(planSerial);

            status= HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "조회 성공!", totalPrice);
        } catch(PlanNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //계획 수정하기
    @PatchMapping("/plans/{planSerial}")
    public ResponseEntity<?> modifyPlan(Authentication authentication, @PathVariable int planSerial, @RequestBody Map<String, Object> params) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            planService.modifyPlanService(portfolioService.getUserSerial(authentication), planSerial, params);

            status= HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "수정 성공!");
        }catch(PlanNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(CustomerNotFoundException e) {
            status = HttpStatus.UNAUTHORIZED;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //공종별 메모 수정하기 -> 이외 공정 정보는 협의가 필요하므로, 나머지 계약 관련 수정 사항은 계약 수정 요청하기로 가야 함
    @PatchMapping("/plans/{planSerial}/works/{workSerial}")
    public ResponseEntity<?> modifyWorkMemo(Authentication authentication, @PathVariable int planSerial, @PathVariable int workSerial, @RequestBody Map<String, Object> params) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            workService.modifyWorkMemoService(portfolioService.getUserSerial(authentication), planSerial,workSerial, params);

            status= HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "수정 성공!");
        }catch(WorkException e) {
            status = HttpStatus.BAD_REQUEST;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(PlanNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(CustomerNotFoundException e) {
            status = HttpStatus.UNAUTHORIZED;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //빈 공종 삭제하기 -> 이미 누군가 배정돼있다면 막 삭제 불가능(계약 파기 api로 가야 함), 누군가 배정돼있지 않을 경우 삭제.
    @DeleteMapping("/plans/{planSerial}/works/{workSerial}")
    public ResponseEntity<?> deleteWork(Authentication authentication, @PathVariable int planSerial, @PathVariable int workSerial) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            workService.deleteWorkService(portfolioService.getUserSerial(authentication), planSerial,workSerial);

            status= HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "삭제 성공!");
        }catch(WorkException e) {
            status = HttpStatus.BAD_REQUEST;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(PlanNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(CustomerNotFoundException e) {
            status = HttpStatus.UNAUTHORIZED;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //계획 삭제 -> 누군가 배정된 공종이 하나라도 있다면 삭제 불가능.(내부의 공종들이 다 빈 상태라면 삭제 가능!!)
    @DeleteMapping("/plans/{planSerial}")
    public ResponseEntity<?> deletePlan(Authentication authentication, @PathVariable int planSerial) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            planService.deletePlanService(portfolioService.getUserSerial(authentication), planSerial);

            status= HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "삭제 성공!");
        }catch(WorkException e) {
            status = HttpStatus.BAD_REQUEST;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(PlanNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(CustomerNotFoundException e) {
            status = HttpStatus.UNAUTHORIZED;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //리뷰 작성하기
    @PostMapping("/plans/{planSerial}/works/{workSerial}/review")
    public ResponseEntity<?> createReview(Authentication authentication, @PathVariable int planSerial, @PathVariable int workSerial, @RequestBody Map<String, Object> params) {
        //시공자 댓글은 null로 두기
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            CustomerReview customerReview = workService.createReviewService(portfolioService.getUserSerial(authentication), planSerial, workSerial, params);

            status= HttpStatus.CREATED;
            responseDTO = new ResponseDTO<>(status.value(), "리뷰 작성 성공!", customerReview);
        }catch(WorkException e) {
            status = HttpStatus.BAD_REQUEST;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(PlanNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(CustomerNotFoundException e) {
            status = HttpStatus.UNAUTHORIZED;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //공유 문서에 이미지 넣기
    @PostMapping("/plans/{planSerial}/image")
    public ResponseEntity<?> uploadImage(@RequestPart MultipartFile image, @PathVariable int planSerial) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            File file = planService.uploadImageService(image, planSerial);

            status= HttpStatus.CREATED;
            responseDTO = new ResponseDTO<>(status.value(), "업로드 성공!", file);
        } catch (S3Exception e) {
            status = HttpStatus.BAD_REQUEST;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //계획 활성화하기
    @PatchMapping("/plans/{planSerial}/activate")
    public ResponseEntity<?> activatePlan(Authentication authentication, @PathVariable int planSerial) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            planService.activatePlanService(portfolioService.getUserSerial(authentication), planSerial);

            status= HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "계획 활성화 성공!");
        } catch (PlanNotFoundException e) {
            status = HttpStatus.NOT_FOUND;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch (UnauthorizedUserException e) {
            status = HttpStatus.UNAUTHORIZED;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //공유 문서에서 이미지 삭제하기
    @DeleteMapping("/plans/{planSerial}/image/{fileSerial}")
    public ResponseEntity<?> deleteImage(Authentication authentication, @PathVariable int planSerial, @PathVariable int fileSerial) {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            planService.deleteImageService(portfolioService.getUserSerial(authentication), planSerial, fileSerial);

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


    //영상 다운로드
    //평면도 가져오기
    //계획, 커스텀 공종 만들기, 공유사항이나 메모 수정 시 유효성검사 필요!!!!!!!!!!!!!!
}

