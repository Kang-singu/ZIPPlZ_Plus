package com.example.zipplz_be.Schedule.service;

import com.example.zipplz_be.Global.entity.Field;
import com.example.zipplz_be.Global.repository.FieldRepository;
import com.example.zipplz_be.Portfolio.entity.CustomerReview;
import com.example.zipplz_be.Portfolio.entity.Portfolio;
import com.example.zipplz_be.Portfolio.repository.CustomerReviewRepository;
import com.example.zipplz_be.Portfolio.repository.PortfolioRepository;
import com.example.zipplz_be.Schedule.entity.Plan;
import com.example.zipplz_be.Schedule.entity.Work;
import com.example.zipplz_be.Schedule.exception.CustomerNotFoundException;
import com.example.zipplz_be.Schedule.exception.DuplicateFieldException;
import com.example.zipplz_be.Schedule.exception.PlanNotFoundException;
import com.example.zipplz_be.Schedule.exception.WorkException;
import com.example.zipplz_be.Schedule.repository.PlanRepository;
import com.example.zipplz_be.Schedule.repository.WorkRepository;
import com.example.zipplz_be.User.entity.Customer;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class WorkService {
    private final WorkRepository workRepository;
    private final PlanRepository planRepository;
    private final FieldRepository fieldRepository;
    private final PortfolioRepository portfolioRepository;
    private final CustomerReviewRepository customerReviewRepository;
    PlanService planService;

    WorkService(CustomerReviewRepository customerReviewRepository, PortfolioRepository portfolioRepository, PlanService planService,WorkRepository workRepository, PlanRepository planRepository, FieldRepository fieldRepository) {
        this.customerReviewRepository = customerReviewRepository;
        this.portfolioRepository = portfolioRepository;
        this.planService = planService;
        this.workRepository = workRepository;
        this.planRepository = planRepository;
        this.fieldRepository = fieldRepository;
    }

    @Transactional
    public List<Work> getWorkListService(int planSerial, Map<String, Object> params) {
        //먼저 planSerial과 일치하는 Work 객체들을 가져오고, 페이징에 맞춰서 return

        Pageable pageable = PageRequest.of(Integer.parseInt((String) params.get("pgno")), Integer.parseInt((String) params.get("spp")));
        Plan plan = planRepository.findByPlanSerial(planSerial);

        if (plan == null) {
            throw new PlanNotFoundException("유효하지 않은 계획 연번입니다.");
        }

        Page<Work> workPage = workRepository.findByPlanSerialAndStatusIn(plan, Arrays.asList("confirmed", "draft"), pageable);

        //해당 Work들에 대해 완료 검사 진행
        //만약 end date가 비어있지 않으면서, 현재 날짜보다 이전이라면 is_completed 1로 바꾸기(업데이트 후 return)

        for (Work work: workPage) {
            Timestamp endDate = work.getEndDate();

            if(work.getEndDate() != null) {
                Timestamp curDate = new Timestamp(System.currentTimeMillis());

                //끝나는 날짜가 지났다면
                if(curDate.after(endDate)) {
                    work.setIsCompleted(1);
                }

                workRepository.save(work);
            }
        }

        return workPage.getContent();
    }

    @Transactional
    public void insertWorkService(int planSerial, Map<String, Object> params) {
        //planSerial 객체 찾기
        //fieldName으로 객체 찾기
        //work에서 fieldName 뒤져보고 있으면 중복이므로 빼기

        String fieldName = (String) params.get("fieldName");
        Plan plan = planRepository.findByPlanSerial(planSerial);

        if (plan == null) throw new PlanNotFoundException("유효하지 않은 계획 연번입니다.");
        if(workRepository.existsByFieldNameAndPlanSerial(fieldName, plan)) {
            //work에 존재한다면?
            throw new DuplicateFieldException("이미 존재하는 공종 분야입니다.");
        }

        Field field = fieldRepository.findByFieldName(fieldName);
        Work work;

        if(field == null) {
            Timestamp endDate = convertStringToTimestamp((String) params.get("endDate"));
            Timestamp startDate = convertStringToTimestamp((String) params.get("startDate"));

            //커스텀이므로 field_id는 0, 이름은 저장해둔 대로
            field = fieldRepository.findByFieldCode(0);

            work = Work.builder()
                    .status("confirmed")
                    .plan(plan)
                    .field(field)
                    .fieldName(fieldName)
                    .startDate(startDate)
                    .endDate(endDate)
                    .workPrice((Integer) params.get("workPrice")).build();
        }
        else {
            work = Work.builder()
                    .status("draft")
                    .plan(plan)
                    .field(field)
                    .fieldName(fieldName)
                    .build();
        }

        workRepository.save(work);
    }

    @Transactional
    public Integer getTotalPriceService(int planSerial) {
        Plan plan = planRepository.findByPlanSerial(planSerial);

        if(plan == null) {
            throw new PlanNotFoundException("유효하지 않은 계획 연번입니다.");
        }

        return workRepository.sumWorkPrice(planSerial);
    }

    private Timestamp convertStringToTimestamp(String dateString) {
        LocalDateTime localDateTime = LocalDateTime.parse(dateString + "T00:00:00");
        return Timestamp.valueOf(localDateTime);
    }

    @Transactional
    public void modifyWorkMemoService(int userSerial,int planSerial, int workSerial, Map<String, Object> params) {
        Customer customer = planService.findUser(userSerial);

        //유효한 계획, 공종인지 검사
        Plan plan = planRepository.findByPlanSerial(planSerial);
        Work work = workRepository.findByWorkSerial(workSerial);

        checkPlanWorkException(customer, plan, work);

        //메모 수정
        work.setWorkContent((String)params.get("workContent"));
        workRepository.save(work);
    }

    @Transactional
    public void deleteWorkService(int userSerial, int planSerial, int workSerial) {
        Customer customer = planService.findUser(userSerial);

        //유효한 계획, 공종인지 검사
        Plan plan = planRepository.findByPlanSerial(planSerial);
        Work work = workRepository.findByWorkSerial(workSerial);

        checkPlanWorkException(customer, plan, work);

        //공종 삭제
        //해당 공종이 비어 있는 상태여야 함.
        if(work.getWorkerSerial() != null) {
            throw new WorkException("계약서가 작성된 공종은 파기 이전엔 삭제할 수 없습니다.");
        }

        workRepository.delete(work);
    }

    @Transactional
    public CustomerReview createReviewService(int userSerial, int planSerial, int workSerial, Map<String, Object> params) {
        Customer customer = planService.findUser(userSerial);

        //유효한 계획, 공종인지 검사
        Plan plan = planRepository.findByPlanSerial(planSerial);
        Work work = workRepository.findByWorkSerial(workSerial);

        CustomerReview cr = customerReviewRepository.findByWorkSerial(work);
        if(cr != null) {
            throw new WorkException("이미 리뷰가 작성된 공종입니다.");
        }

        checkPlanWorkException(customer, plan, work);

        //포트폴리오 찾기
        Portfolio portfolio = portfolioRepository.findByWorkerAndFieldId(work.getWorkerSerial(), work.getFieldCode());
        Timestamp curDate = new Timestamp(System.currentTimeMillis());

        //리뷰 작성
        CustomerReview customerReview = CustomerReview.builder()
                .workSerial(work)
                .customer(customer)
                .customerReviewContent((String)params.get("reviewContent"))
                .customerReviewDate(curDate)
                .attitudeStar((Integer) params.get("attitudeStar"))
                .isVisible((Integer)params.get("isVisible"))
                .communicationStar((Integer) params.get("communicationStar"))
                .qualityStar((Integer) params.get("qualityStar"))
                .professionalStar((Integer) params.get("professionalStar"))
                .portfolio(portfolio).build();

        customerReviewRepository.save(customerReview);

        //해당 리뷰의 평균을 내서, 그 평균만큼 온도를 올리거나 내린다.
        int professionalStar = customerReview.getProfessionalStar();
        int attitudeStar = customerReview.getAttitudeStar();
        int qualityStart = customerReview.getQualityStar();
        int communicationStar = customerReview.getCommunicationStar();

        double averageStar = (double)(professionalStar + attitudeStar + qualityStart + communicationStar) /4;
        averageStar -= 2.5;
        averageStar *= 0.1;

        //2.5에서의 거리 * 0.1만큼 온도를 올리거나 내린다.
        portfolio.setTemperature(portfolio.getTemperature() + averageStar);
        portfolioRepository.save(portfolio);

        return customerReview;
    }

    public void checkPlanWorkException(Customer customer, Plan plan, Work work) {
        if(plan == null) throw new PlanNotFoundException("유효하지 않은 계획 연번입니다.");
        if(work == null || (plan.getPlanSerial() != work.getPlanSerial().getPlanSerial())) throw new WorkException("유효하지 않은 공종 연번입니다.");

        //로그인한 유저가 계획 소유자인지 검사
        if(!plan.getCustomerSerial().equals(customer)) {
            throw new CustomerNotFoundException("현재 유저는 고객이 아니거나 유효하지 않은 유저입니다.");
        }
    }

}

