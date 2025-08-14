package com.example.zipplz_be.Schedule.service;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.util.IOUtils;
import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.File.repository.FileRepository;
import com.example.zipplz_be.Global.relation.PlanFileRelation;
import com.example.zipplz_be.Global.entity.Field;
import com.example.zipplz_be.Global.repository.FieldRepository;
import com.example.zipplz_be.Global.repository.PlanFileRelationRepository;
import com.example.zipplz_be.Portfolio.dto.PortfolioWorkListDTO;
import com.example.zipplz_be.Portfolio.exception.UnauthorizedUserException;
import com.example.zipplz_be.Portfolio.service.PortfolioService;
import com.example.zipplz_be.Schedule.dto.PlanDetailDTO;
import com.example.zipplz_be.Schedule.dto.TodayWorkListDTO;
import com.example.zipplz_be.Schedule.dto.WorkListDTO;
import com.example.zipplz_be.Schedule.entity.Plan;
import com.example.zipplz_be.Schedule.entity.Work;
import com.example.zipplz_be.Schedule.exception.CustomerNotFoundException;
import com.example.zipplz_be.Schedule.exception.PlanNotFoundException;
import com.example.zipplz_be.Schedule.exception.S3Exception;
import com.example.zipplz_be.Schedule.exception.WorkException;
import com.example.zipplz_be.Schedule.repository.PlanRepository;
import com.example.zipplz_be.Schedule.repository.WorkRepository;
import com.example.zipplz_be.User.entity.Customer;
import com.example.zipplz_be.User.entity.User;
import com.example.zipplz_be.User.entity.Worker;
import com.example.zipplz_be.User.exception.UserNotFoundException;
import com.example.zipplz_be.User.repository.CustomerRepository;
import com.example.zipplz_be.User.repository.UserRepository;
import com.example.zipplz_be.User.repository.WorkerRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Slf4j
@Service
public class PlanService {
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucketName}")
    private String bucketName;

    private final PlanRepository planRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final FieldRepository fieldRepository;
    private final WorkRepository workRepository;
    private final FileRepository fileRepository;
    private final PlanFileRelationRepository planFileRelationRepository;
    private final WorkerRepository workerRepository;

    private final PortfolioService portfolioService;
//    private final WorkService workService;

    PlanService(PortfolioService portfolioService, WorkerRepository workerRepository, PlanFileRelationRepository planFileRelationRepository , FileRepository fileRepository,AmazonS3 amazonS3, WorkRepository workRepository, PlanRepository planRepository, CustomerRepository customerRepository, UserRepository userRepository,FieldRepository fieldRepository) {
        //this.workService = workService;
        this.portfolioService = portfolioService;
        this.workerRepository = workerRepository;
        this.planFileRelationRepository = planFileRelationRepository;
        this.fileRepository = fileRepository;
        this.amazonS3 = amazonS3;
        this.workRepository = workRepository;
        this.planRepository = planRepository;
        this.customerRepository= customerRepository;
        this.userRepository = userRepository;
        this.fieldRepository = fieldRepository;
    }

    @Transactional
    public List<Plan> getPlanService(int userSerial) {
        Customer customer = findUser(userSerial);

        return planRepository.findBycustomerSerial(customer);
    }

    @Transactional
    public void deactivatePlanStatus(Customer customer) {
        List<Plan> planList = planRepository.findBycustomerSerial(customer);

        for(Plan plan: planList) {
            plan.setIsActive(0);

            planRepository.save(plan);
        }
    }


    @Transactional
    public void insertPlanService(int userSerial, Map<String, Object> params) {
        Customer customer = findUser(userSerial);

        String planName = (String) params.get("planName");

        if(planName == null || planName.equals("")) {
            planName = customer.getNickname() + "의 계획";
        }

        //모든 plan을 deactivate
        this.deactivatePlanStatus(customer);

        Plan plan = Plan.builder()
                .planName(planName)
                .address((String) params.get("address"))
                .sharedContents((String) params.get("sharedContents"))
                .customer(customer)
                .build();

        planRepository.save(plan);

        //메인 기본 공종들 work에 추가
        //공종들 불러와서 필드 리스트에 저장
        List<Field> fieldList = fieldRepository.findAll();

        //리스트 돌면서 각각 필드 id와 이름을 채우며 빈 공종들을 만들자!!
        for(Field field : fieldList) {
            if(field.getFieldCode() != 0) {
                Work work = Work.builder()
                        .status("draft")
                        .field(field)
                        .fieldName(field.getFieldName())
                        .plan(plan).build();

                workRepository.save(work);
            }
        }
    }
    @Transactional
    public void modifyPlanService(int userSerial, int planSerial, Map<String, Object> params) {
        System.out.println(userSerial);
        Customer customer = findUser(userSerial);

        //계획 소유자인지 검사
        Plan plan = planRepository.findByPlanSerial(planSerial);
        if(plan == null) {
            throw new PlanNotFoundException("유효하지 않은 계획 연번입니다.");
        }
        if(plan.getCustomerSerial().getCustomerSerial() != customer.getCustomerSerial()) {
            throw new CustomerNotFoundException("현재 유저는 고객이 아니거나 유효하지 않은 유저입니다.");
        }

        //주어진 요소 수정(수정되지 않은 부분은 원본으로 들어와야 함!!)
        plan.setPlanName((String) params.get("planName"));
        plan.setSharedContents((String) params.get("sharedContents"));

        planRepository.save(plan);
    }

    @Transactional
    public void deletePlanService(int userSerial, int planSerial) {
        Customer customer = findUser(userSerial);

        //계획 소유자인지 검사
        Plan plan = planRepository.findByPlanSerial(planSerial);
        if(plan == null) {
            throw new PlanNotFoundException("유효하지 않은 계획 연번입니다.");
        }
        if(!plan.getCustomerSerial().equals(customer)) {
            throw new CustomerNotFoundException("현재 유저는 고객이 아니거나 유효하지 않은 유저입니다.");
        }

        //계획의 모든 공종들을 살펴보며, 모두 비어있다면, 그 공종들도 모두 날리고 마지막으로 plan을 삭제한다.
        List<Work> workList = workRepository.findByPlanSerial(plan);

        for(Work work: workList) {
            if(work.getWorkerSerial() != null) {
                throw new WorkException("계약서가 작성된 공종은 파기 이전엔 삭제할 수 없습니다.");
            }
        }

        planRepository.delete(plan);
    }


    public Customer findUser(int userSerial) {
        //현재 로그인한 유저의 계획으로 집주소, 공유내용 포함하여 추가
        User user = userRepository.findByUserSerial(userSerial);

        Customer customer = customerRepository.findByUserSerial(user);

        //여기서 null이면 고객이 아닌 것
        if(customer == null) {
            throw new CustomerNotFoundException("현재 유저는 고객이 아니거나 유효하지 않은 유저입니다.");
        }

        return customer;
    }

    @Transactional
    public PlanDetailDTO getPlanDetailService(int userSerial, int planSerial) {
        Plan plan = planRepository.findByPlanSerial(planSerial);

        User user = userRepository.findByUserSerial(userSerial);
        Customer customer = customerRepository.findByUserSerial(user);
        if(plan == null) {
            throw new PlanNotFoundException("유효하지 않은 계획 연번입니다.");
        }
        if(!plan.getCustomerSerial().equals(customer)) {
            throw new CustomerNotFoundException("현재 유저는 고객이 아니거나 유효하지 않은 유저입니다.");
        }

        List<PlanFileRelation> planFileRelationList = planFileRelationRepository.findByPlanSerial(plan);

        List<File> fileList = new ArrayList<>();

        for(PlanFileRelation planFileRelation : planFileRelationList) {
            fileList.add(planFileRelation.getFileSerial());
        }

        PlanDetailDTO planDetailDTO = PlanDetailDTO.builder()
                .plan(plan)
                .fileList(fileList)
                .build();

        return planDetailDTO;
    }

    //이미지 업로드 시리즈
    @Transactional
    public File uploadImageService(MultipartFile image, int planSerial) {
        if(image.isEmpty() || Objects.isNull(image.getOriginalFilename())) {
            throw new S3Exception("파일이 비었습니다.");
        }
        Plan plan = planRepository.findByPlanSerial(planSerial);

        if(plan == null) {
            throw new PlanNotFoundException("유효하지 않은 계획 연번입니다.");
        }

        String url = this.uploadImage(image);
        File file = fileRepository.findBySaveFile(url);

        PlanFileRelation planFileRelation = PlanFileRelation.builder()
                .fileSerial(file)
                .planSerial(plan)
                .build();

        planFileRelationRepository.save(planFileRelation);
        return file;
    }

    public String uploadImage(MultipartFile image) {
        this.validateImageFileExtension(image.getOriginalFilename());

        try {
            return this.uploadToS3(image);
        }catch(IOException e) {
            throw new S3Exception("이미지 업로드 중 에러 발생했습니다.");
        }

    }

    private String uploadToS3(MultipartFile image) throws IOException {
        String originalFilename = image.getOriginalFilename();

        String extention = originalFilename.substring(originalFilename.lastIndexOf(".")+1).toLowerCase();

        //파일명
        String s3FileName = UUID.randomUUID().toString().substring(0, 10) + originalFilename;

        InputStream is = image.getInputStream();
        byte[] bytes = IOUtils.toByteArray(is);

        ObjectMetadata metadata = new ObjectMetadata(); //metadata 생성
        metadata.setContentType("image/" + extention);
        metadata.setContentLength(bytes.length);

        //S3에 요청할 때 사용할 byteInputStream 생성
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
        String url = "";

        try {
            // 업로드 직전 로그
            log.info("S3 업로드 시도 - 파일명: {}, 확장자: {}, 크기: {}, 버킷: {}", s3FileName, extention, bytes.length, bucketName);


            //S3로 putObject 할 때 사용할 요청 객체
            //생성자 : bucket 이름, 파일 명, byteInputStream, metadata
            PutObjectRequest putObjectRequest =
                    new PutObjectRequest(bucketName, s3FileName, byteArrayInputStream, metadata)
                            .withCannedAcl(CannedAccessControlList.PublicRead);

            //실제로 S3에 이미지 데이터를 넣는 부분
            amazonS3.putObject(putObjectRequest);

            url = amazonS3.getUrl(bucketName, s3FileName).toString();
            log.info("S3 업로드 완료 - URL : {}", url);

            //file 객체 하나 만들어서 repository로 db에 추가
            File file = new File();
            file.setSaveFile(url);
            file.setFileName(s3FileName);
            file.setOriginalFile(image.getOriginalFilename());

            fileRepository.save(file);
        } catch (Exception e){
            log.error("S3 업로드 실패", e);
            throw new S3Exception("Put Object 도중에 에러 발생" + e.getMessage());
        }finally {
            byteArrayInputStream.close();
            is.close();
        }

        return url;
    }

    private void validateImageFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            throw new S3Exception("파일 형식이 존재하지 않습니다.");
        }

        String extention = filename.substring(lastDotIndex + 1).toLowerCase();
        List<String> allowedExtentionList = Arrays.asList("jpg", "jpeg", "png", "gif");

        if (!allowedExtentionList.contains(extention)) {
            throw new S3Exception("유효하지 않은 파일 형식입니다.");
        }

    }

    @Transactional
    public List<WorkListDTO> getUsersWorkListService(int userSerial) {
        User user = userRepository.findByUserSerial(userSerial);
        List<WorkListDTO> workListDTOList = new ArrayList<>();

        if(user.getRole().equals("")) {
            throw new UserNotFoundException("유저의 역할이 비어 있습니다.");
        }

        if(user.getRole().equals("worker")) {
            Worker worker = workerRepository.findByUserSerial(user);

            List<PortfolioWorkListDTO> portfolioWorkListDTOList = portfolioService.getWorkerScheduleService(worker.getWorkerSerial());

            for(PortfolioWorkListDTO portfolioWorkListDTO: portfolioWorkListDTOList) {
                WorkListDTO workListDTO = WorkListDTO.builder()
                        .startDate(portfolioWorkListDTO.getStartDate())
                        .endDate(portfolioWorkListDTO.getEndDate())
                        .field(portfolioWorkListDTO.getFieldName())
                        .build();

                workListDTOList.add(workListDTO);
            }
        }else {
            //계획에서 해당 고객의 계획 빼오고, 그 계획의 공종들 전부 가져와야함
            Customer customer = customerRepository.findByUserSerial(user);
            List<Plan> planList = planRepository.findBycustomerSerial(customer);

            //계획 목록에 따른 workList 가져오기
            for(Plan plan: planList) {
                //DTO에 담아서 리스트에 추가하기
                //해당 계획의 work들 가져옴
                List<Work> workList = workRepository.findByPlanSerial(plan);

                for(Work work : workList) {
                    if(!work.getStatus().equals("confirmed")) continue;

                    WorkListDTO workListDTO = WorkListDTO.builder()
                            .endDate(portfolioService.convertTimestamp(work.getEndDate()))
                            .startDate(portfolioService.convertTimestamp(work.getStartDate()))
                            .field(work.getFieldName())
                            .build();

                    workListDTOList.add(workListDTO);
                }
            }
        }

        return workListDTOList;
    }

    @Transactional
    public List<TodayWorkListDTO> getWorkingWorkService(int userSerial) {
        User user = userRepository.findByUserSerial(userSerial);
        List<TodayWorkListDTO> todayWorkListDTOList = new ArrayList<>();

        if(user.getRole().equals("")) {
            throw new UserNotFoundException("유저의 역할이 비어 있습니다.");
        }

        if(user.getRole().equals("worker")) {
            Worker worker = workerRepository.findByUserSerial(user);
            List<Work> workList = workRepository.getTodayWork(worker.getWorkerSerial());

            for(Work work : workList) {
                if(!work.getStatus().equals("confirmed")) continue;

                Customer customer = work.getPlanSerial().getCustomerSerial();

                TodayWorkListDTO workListDTO = TodayWorkListDTO.builder()
                        .workSerial(work.getWorkSerial())
                        .startDate(portfolioService.convertTimestamp(work.getStartDate()))
                        .endDate(portfolioService.convertTimestamp(work.getEndDate()))
                        .field(work.getFieldName())
                        .address(work.getPlanSerial().getAddress())
                        .worker(worker)
                        .customer(customer)
                        .workerProfile(worker.getUserSerial().getFileSerial())
                        .customerProfile(customer.getUserSerial().getFileSerial())
                        .build();

                todayWorkListDTOList.add(workListDTO);
            }
        } else {
            //계획에서 해당 고객의 계획 빼오고, 그 계획의 공종들 전부 가져와야함
            Customer customer = customerRepository.findByUserSerial(user);
            List<Plan> planList = planRepository.findBycustomerSerial(customer);

            for(Plan plan: planList) {
                List<Work> workList = workRepository.getTodayWorkByPlan(plan.getPlanSerial());

                for(Work work : workList) {
                    if(!work.getStatus().equals("confirmed")) continue;

                    TodayWorkListDTO workListDTO = TodayWorkListDTO.builder()
                            .workSerial(work.getWorkSerial())
                            .endDate(portfolioService.convertTimestamp(work.getEndDate()))
                            .startDate(portfolioService.convertTimestamp(work.getStartDate()))
                            .field(work.getFieldName())
                            .address(plan.getAddress())
                            .worker(work.getWorkerSerial())
                            .customer(customer)
                            .workerProfile(work.getWorkerSerial().getUserSerial().getFileSerial())
                            .customerProfile(customer.getUserSerial().getFileSerial())
                            .build();

                    todayWorkListDTOList.add(workListDTO);
                }
            }
        }

        return todayWorkListDTOList;
    }

    @Transactional
    public void activatePlanService(int userSerial, int planSerial) {
        User user = userRepository.findByUserSerial(userSerial);
        Customer customer = customerRepository.findByUserSerial(user);

        Plan curPlan = planRepository.findByPlanSerial(planSerial);

        if(curPlan == null) throw new PlanNotFoundException("유효하지 않은 계획 연번입니다.");
        if(curPlan.getCustomerSerial().getCustomerSerial() != customer.getCustomerSerial()) {
            throw new UnauthorizedUserException("활성화할 권한이 없습니다.");
        }

        Plan originalPlan = planRepository.findByCustomerSerialAndIsActive(customer, 1);
        originalPlan.setIsActive(0);
        planRepository.save(originalPlan);

        curPlan.setIsActive(1);
        planRepository.save(curPlan);
    }


    //fileSerial 받았으니까 일단 이 객체를 관계 테이블에서 삭제하고, 해당 file 또한 s3에서 삭제하고 지운다!
    @Transactional
    public void deleteImageService(int userSerial, int planSerial, int fileSerial) throws IOException {
        Plan plan = planRepository.findByPlanSerial(planSerial);
        File file = fileRepository.findByFileSerial(fileSerial);

        if(userSerial != plan.getCustomerSerial().getUserSerial().getUserSerial()) {
            throw new UnauthorizedUserException("삭제할 권한이 없습니다.");
        }

        PlanFileRelation planFileRelation = planFileRelationRepository.findByPlanSerialAndFileSerial(plan, file);
        planFileRelationRepository.delete(planFileRelation);
        
        //파일을 S3에서 삭제
        deleteS3(file.getFileName());

        fileRepository.delete(file);
    }

    public void deleteS3(String fileName) throws IOException{
        try {
            amazonS3.deleteObject(bucketName, fileName);
        } catch(SdkClientException e) {
            throw new IOException("Error Deleting file in S3", e);
        }
    }
}
