package com.example.zipplz_be.Chatting.service;

import com.example.zipplz_be.Chatting.dto.ChatMessageRequestDTO;
import com.example.zipplz_be.Chatting.dto.ContractDTO;
import com.example.zipplz_be.Chatting.dto.ContractRequestDTO;
import com.example.zipplz_be.Chatting.entity.ChatMessage;
import com.example.zipplz_be.Chatting.entity.Chatroom;
import com.example.zipplz_be.Chatting.entity.Request;
import com.example.zipplz_be.Chatting.exception.DuplicateContractException;
import com.example.zipplz_be.Chatting.repository.ChatroomRepository;
import com.example.zipplz_be.Chatting.repository.RequestRepository;
import com.example.zipplz_be.Chatting.repository.ChatMessageRepository;
import com.example.zipplz_be.Material.entity.Material;
import com.example.zipplz_be.Material.repository.MaterialRepository;
import com.example.zipplz_be.Global.relation.MaterialWorkRelation;
import com.example.zipplz_be.Global.entity.Field;
import com.example.zipplz_be.Global.entity.MessageType;
import com.example.zipplz_be.Global.entity.Status;
import com.example.zipplz_be.Global.repository.FieldRepository;
import com.example.zipplz_be.Global.repository.MaterialWorkRelationRepository;
import com.example.zipplz_be.Portfolio.entity.Portfolio;
import com.example.zipplz_be.Portfolio.exception.UnauthorizedUserException;
import com.example.zipplz_be.Portfolio.repository.PortfolioRepository;
import com.example.zipplz_be.Schedule.entity.Plan;
import com.example.zipplz_be.Schedule.entity.Work;
import com.example.zipplz_be.Schedule.exception.WorkerNotFoundException;
import com.example.zipplz_be.Schedule.repository.PlanRepository;
import com.example.zipplz_be.Schedule.repository.WorkRepository;
import com.example.zipplz_be.User.entity.Customer;
import com.example.zipplz_be.User.entity.User;
import com.example.zipplz_be.User.entity.Worker;
import com.example.zipplz_be.User.repository.CustomerRepository;
import com.example.zipplz_be.User.repository.UserRepository;
import com.example.zipplz_be.User.repository.WorkerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.text.NumberFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ContractService {
    private final PlanRepository planRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final WorkRepository workRepository;
    private final WorkerRepository workerRepository;
    private final FieldRepository fieldRepository;
    private final MaterialRepository materialRepository;
    private final MaterialWorkRelationRepository materialWorkRelationRepository;
    private final RequestRepository requestRepository;
    private final ChatroomRepository chatroomRepository;
    private final PortfolioRepository portfolioRepository;
    private final ChatMessageService chatMessageService;
    private final ChatMessageRepository chatMessageRepository;

    ContractService(PortfolioRepository portfolioRepository, ChatroomRepository chatroomRepository, RequestRepository requestRepository, MaterialWorkRelationRepository materialWorkRelationRepository, MaterialRepository materialRepository, FieldRepository fieldRepository, WorkerRepository workerRepository, WorkRepository workRepository, UserRepository userRepository, CustomerRepository customerRepository, PlanRepository planRepository, ChatMessageService chatMessageService, ChatMessageRepository chatMessageRepository) {
        this.portfolioRepository = portfolioRepository;
        this.chatroomRepository = chatroomRepository;
        this.requestRepository = requestRepository;
        this.materialWorkRelationRepository= materialWorkRelationRepository;
        this.materialRepository = materialRepository;
        this.fieldRepository = fieldRepository;
        this.workerRepository = workerRepository;
        this.workRepository = workRepository;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.planRepository = planRepository;
        this.chatMessageService = chatMessageService;
        this.chatMessageRepository = chatMessageRepository;
    }

    @Transactional
    public ContractRequestDTO insertContractDraftService(int userSerial, int chatroomSerial, Map<String, Object> params) {
        User user = userRepository.findByUserSerial(userSerial);
        Worker worker = workerRepository.findByUserSerial(user);

        if(worker == null) {
            throw new WorkerNotFoundException("계약서를 초본 작성하는 유저가 유효한 시공자가 아닙니다.");
        }

        //해당 고객 찾기
        Chatroom chatroom = chatroomRepository.findByChatroomSerial(chatroomSerial);
        Customer customer = customerRepository.findByUserSerial(chatroom.getCuser());

        Plan plan = planRepository.findByCustomerSerialAndIsActive(customer, 1);

        String fieldName = chatroom.getFieldName();
        Field field = fieldRepository.findByFieldName(fieldName);

        //plan과 분야, awaiting으로 존재하는지 확인
        List<Work> works = workRepository.findByPlanSerialAndFieldNameAndStatus(plan, fieldName, "awaiting");

        if(!works.isEmpty()) {
            throw new DuplicateContractException("요청된 계약서 초안이 존재합니다.");
        }

        List<Work> confirmWorkList = workRepository.findByPlanSerialAndFieldNameAndStatus(plan, fieldName, "confirmed");
        System.out.println(confirmWorkList.size());

        if(!confirmWorkList.isEmpty()) {
            throw new DuplicateContractException("임시 확정된 계약서가 존재합니다. 수정 요청을 해주세요!");
        }

        Timestamp endDate = convertStringToTimestamp((String) params.get("endDate"));
        Timestamp startDate = convertStringToTimestamp((String) params.get("startDate"));

        //자재 리스트
        List<Integer> materialList  = (List<Integer>) params.get("materialList");

        List<Work> originalWork = workRepository.findByPlanSerialAndFieldNameAndStatus(plan, fieldName, "draft");
        Work work = Work.builder()
                .status("awaiting")
                .endDate(endDate)
                .startDate(startDate)
                .fieldName(fieldName)
                .workPrice((Integer) params.get("workPrice"))
                .field(field)
                .plan(plan)
                .build();

        work.setWorkerSerial(worker);
        workRepository.save(work);


        //자재 리스트를 자재-공종 관계 테이블에 삽입(공종은 지금 넣을걸로)
        for(int i: materialList) {
            Material material = materialRepository.findByMaterialSerial(i);

            MaterialWorkRelation materialWorkRelation = MaterialWorkRelation.builder()
                    .materialSerial(material)
                    .workSerial(work)
                    .build();

            materialWorkRelationRepository.save(materialWorkRelation);
        }

        Timestamp curDate = new Timestamp(System.currentTimeMillis());

        //요청 테이블에 해당 요청을 삽입
        Request request = Request.builder()
                .requestComment((String) params.get("requestComment"))
                .workSerial(originalWork.get(0))
                .receiver(userRepository.findByUserSerial(customer.getUserSerial().getUserSerial()))
                .sender(user)
                .requestDate(curDate)
                .requestStatus("pending")
                .requestType("add")
                .build();

        requestRepository.save(request);

        ContractRequestDTO contractRequestDTO = ContractRequestDTO.builder()
                .requestSerial(request.getRequestSerial())
                .requestDate(convertTimestamp(request.getRequestDate()))
                .senderName(request.getSender().getUserName())
                .receiverName(request.getReceiver().getUserName())
                .requestComment(request.getRequestComment())
                .requestStatus(request.getRequestStatus())
                .requestType(request.getRequestType())
                .build();

        return contractRequestDTO;
    }

    @Transactional
    public ContractDTO getContractService(int userSerial, int workSerial) {
        Work work = workRepository.findByWorkSerial(workSerial);
        Plan plan = work.getPlanSerial();

        User w_user = work.getWorkerSerial().getUserSerial();
        User c_user = plan.getCustomerSerial().getUserSerial();

        if(userSerial != w_user.getUserSerial() && userSerial != c_user.getUserSerial()) {
            throw new UnauthorizedUserException("계약서를 조회할 권한이 없습니다.");
        }

        Worker worker = workerRepository.findByUserSerial(w_user);
        Portfolio portfolio = portfolioRepository.findByWorkerAndFieldId(worker, work.getFieldCode());

        // materialWork - 자재 리스트(해당 work 연번에 따라 가져오기)
        List<MaterialWorkRelation> materialWorkRelationList = materialWorkRelationRepository.findByWorkSerial(work);
        List<String> materialNameList = new ArrayList<>();

        for(MaterialWorkRelation materialWorkRelation: materialWorkRelationList) {
            Material material = materialWorkRelation.getMaterialSerial();
            materialNameList.add(material.getMaterialName());
        }

        ContractDTO contractDTO = ContractDTO.builder()
                .workerName(w_user.getUserName())
                .company(worker.getCompany())
                .businessNumber(worker.getBusinessNumber())
                .workerTel(w_user.getTel())
                .customerName(c_user.getUserName())
                .customerTel(c_user.getTel())
                .address(plan.getAddress())
                .startDate(convertTimestamp(work.getStartDate()))
                .endDate(convertTimestamp(work.getEndDate()))
                .workPrice(work.getWorkPrice())
                .fieldName(work.getFieldName())
                .materialList(materialNameList)
                .build();

        if(portfolio != null) {
            contractDTO.setAsPeriod(portfolio.getAsPeriod());
        }
        return contractDTO;
    }

    @Transactional
    public void acceptRequestService(int userSerial, Map<String, Object> params) {
        Request request =  requestRepository.getPendingRequest((Integer)params.get("sender"), (Integer)params.get("receiver"));

        System.out.println(userSerial);

        if(request.getReceiver().getUserSerial() != userSerial) {
            throw new UnauthorizedUserException("수락할 권한이 없습니다.");
        }
        if(!request.getRequestStatus().equals("pending")) {
            throw new DuplicateContractException("이미 처리된 요청사항입니다.");
        }

        //1. 요청 상태 바꾸기.(accepted)
        request.setRequestStatus("accepted");
        requestRepository.save(request);

        Work originalWork = workRepository.findByWorkSerial(request.getWorkSerial().getWorkSerial());
        List<MaterialWorkRelation> materialOriginalList = materialWorkRelationRepository.findByWorkSerial(originalWork);

        List<Work> awaitingWork = workRepository.findByPlanSerialAndFieldNameAndStatus(originalWork.getPlanSerial(), originalWork.getFieldName(), "awaiting");

        if(request.getRequestType().equals("delete")) {
            if(!awaitingWork.isEmpty()) {
                throw new DuplicateContractException("이전 요청을 먼저 처리해주세요.");
            }

            //요청이 응답되기 전에 다른 요청이 또 가면 안 됨

            //지금까지 해당 work_serial에 맞는 log들 다 날리기
            List<Request> requestList = requestRepository.findByWorkSerial(originalWork);

            for(Request request1 : requestList) {
                requestRepository.delete(request1);
            }

            for(MaterialWorkRelation materialWorkRelation: materialOriginalList) {
                materialWorkRelationRepository.delete(materialWorkRelation);
            }

            originalWork.setStatus("draft");
            originalWork.setIsCompleted(0);
            originalWork.setWorkPrice(0);
            originalWork.setEndDate(null);
            originalWork.setStartDate(null);
            originalWork.setWorkerSerial(null);
            originalWork.setWorkContent(null);
        }
        else {
            if(awaitingWork.size() != 1) {
                throw new DuplicateContractException("복수의 수정 요청이 존재하거나 요청 사항이 존재하지 않습니다.");
            }

            //기존 공종(confirmed 혹은 draft)에 awaiting 공종 뒤집어씌우고, confirmed로 바꾸기.
            originalWork.setStatus("confirmed");
            BeanUtils.copyProperties(awaitingWork.get(0), originalWork, "workSerial", "status", "workContent");

            //자재 처리하기
            List<MaterialWorkRelation> materialWorkRelationList = materialWorkRelationRepository.findByWorkSerial(awaitingWork.get(0));

            //기존꺼 지우기
            for(MaterialWorkRelation materialWorkRelation: materialOriginalList) {
                materialWorkRelationRepository.delete(materialWorkRelation);
            }

            //새롭게 덮기
            for(MaterialWorkRelation materialWorkRelation: materialWorkRelationList) {
                MaterialWorkRelation newMaterial = MaterialWorkRelation.builder()
                        .workSerial(originalWork)
                        .materialSerial(materialWorkRelation.getMaterialSerial())
                        .build();

                materialWorkRelationRepository.save(newMaterial);
                materialWorkRelationRepository.delete(materialWorkRelation);
            }

            //awaiting 공종은 삭제하기.
            workRepository.delete(awaitingWork.get(0));
        }

        int chatroomSerial = getChatroomSerial(request, originalWork.getFieldName());
        System.out.println("chatroomSerial : " + chatroomSerial);
        System.out.println("senderSerial:    " + (Integer)params.get("sender"));
        ChatMessage currMsg = chatMessageRepository.findByChatroomSerialAndUserSerialAndFileType(chatroomSerial, (Integer)params.get("sender"), MessageType.CONTRACT);
        currMsg.setFileType(MessageType.CONTRACT_ACCEPTED);
        chatMessageRepository.save(currMsg);
        workRepository.save(originalWork);
    }

    @Transactional
    public void rejectRequestService(int userSerial, Map<String, Object> params) {
        Request request = requestRepository.getPendingRequest((Integer)params.get("sender"), (Integer)params.get("receiver"));

        if(request.getReceiver().getUserSerial() != userSerial) {
            throw new UnauthorizedUserException("거절할 권한이 없습니다.");
        }
        if(!request.getRequestStatus().equals("pending")) {
            throw new DuplicateContractException("이미 처리된 요청사항입니다.");
        }

        //요청 상태 바꾸기.(rejected)
        request.setRequestStatus("rejected");
        requestRepository.save(request);

        if(!request.getRequestType().equals("delete")) {
            Work originalWork = workRepository.findByWorkSerial(request.getWorkSerial().getWorkSerial());
            List<Work> awaitingWork = workRepository.findByPlanSerialAndFieldNameAndStatus(originalWork.getPlanSerial(), originalWork.getFieldName(), "awaiting");

            if(awaitingWork.size() != 1) {
                throw new DuplicateContractException("한 계약에 복수의 요청이 존재하거나, 요청이 존재하지 않습니다.");
            }

            //자재 처리하기
            List<MaterialWorkRelation> materialWorkRelationList = materialWorkRelationRepository.findByWorkSerial(awaitingWork.get(0));

            for(MaterialWorkRelation materialWorkRelation: materialWorkRelationList) {
                materialWorkRelationRepository.delete(materialWorkRelation);
            }

            //awaiting 공종은 삭제하기.
            workRepository.delete(awaitingWork.get(0));

            int chatroomSerial = getChatroomSerial(request, originalWork.getFieldName());
            ChatMessage currMsg = chatMessageRepository.findByChatroomSerialAndUserSerialAndFileType(chatroomSerial, (Integer)params.get("sender"), MessageType.CONTRACT);
            currMsg.setFileType(MessageType.CONTRACT_REJECTED);
            chatMessageRepository.save(currMsg);
            workRepository.save(originalWork);
        }
    }

    @Transactional
    public ContractRequestDTO insertModifyRequestService(int userSerial, int chatroomSerial, Map<String, Object> params) {
        //어느 한쪽이 수정 요청을 날린다.(로그인한 쪽이 sender)
        User user = userRepository.findByUserSerial(userSerial);
        User sender, receiver;

        Chatroom chatroom = chatroomRepository.findByChatroomSerial(chatroomSerial);
        Customer customer = customerRepository.findByUserSerial(chatroom.getCuser());
        Worker worker = workerRepository.findByUserSerial(chatroom.getWuser());
        Plan plan = planRepository.findByCustomerSerialAndIsActive(customer, 1);

        if(chatroom.getCuser().getUserSerial() == user.getUserSerial()) {
            sender = chatroom.getCuser();
            receiver = chatroom.getWuser();
        } else if(chatroom.getWuser().getUserSerial() == user.getUserSerial()) {
            sender = chatroom.getWuser();
            receiver = chatroom.getCuser();
        } else {
            throw new UnauthorizedUserException("수정 요청 권한이 없습니다.");
        }

        Timestamp endDate = convertStringToTimestamp((String) params.get("endDate"));
        Timestamp startDate = convertStringToTimestamp((String) params.get("startDate"));

        String fieldName = chatroom.getFieldName();
        Field field = fieldRepository.findByFieldName(fieldName);

        //plan과 분야, awaiting으로 존재하는지 확인
        List<Work> works = workRepository.findByPlanSerialAndFieldNameAndStatus(plan, fieldName, "awaiting");

        if(!works.isEmpty()) {
            throw new DuplicateContractException("이전 요청을 먼저 처리해주세요.");
        }

        //자재 리스트
        List<Integer> materialList  = (List<Integer>) params.get("materialList");
        List<Work> originalWork = workRepository.findByPlanSerialAndFieldNameAndStatus(plan, fieldName, "confirmed");

        if(originalWork.size() != 1) {
            throw new DuplicateContractException("confirmed 상태인 요청이 하나가 아닙니다.");
        }

        //awaiting 공종 삽입
        Work work = Work.builder()
                .status("awaiting")
                .endDate(endDate)
                .startDate(startDate)
                .fieldName(fieldName)
                .workPrice((Integer) params.get("workPrice"))
                .field(field)
                .plan(plan)
                .build();
        work.setWorkerSerial(worker);
        workRepository.save(work);

        //자재 리스트를 자재-공종 관계 테이블에 삽입(공종은 지금 넣을걸로)
        for(int i: materialList) {
            Material material = materialRepository.findByMaterialSerial(i);

            MaterialWorkRelation materialWorkRelation = MaterialWorkRelation.builder()
                    .materialSerial(material)
                    .workSerial(work)
                    .build();

            materialWorkRelationRepository.save(materialWorkRelation);
        }

        Timestamp curDate = new Timestamp(System.currentTimeMillis());

        Request request = Request.builder()
                .requestComment((String) params.get("requestComment"))
                .workSerial(originalWork.get(0))
                .receiver(receiver)
                .sender(sender)
                .requestDate(curDate)
                .requestStatus("pending")
                .requestType("modify")
                .build();

        requestRepository.save(request);

        ContractRequestDTO contractRequestDTO = ContractRequestDTO.builder()
                .requestSerial(request.getRequestSerial())
                .requestDate(convertTimestamp(request.getRequestDate()))
                .senderName(request.getSender().getUserName())
                .receiverName(request.getReceiver().getUserName())
                .requestComment(request.getRequestComment())
                .requestStatus(request.getRequestStatus())
                .requestType(request.getRequestType())
                .build();

        // 수정 요청 send message
        String workerName = worker.getUserSerial().getUserName();
        String customerName = customer.getUserSerial().getUserName();
        int totalDuration = calculateTotalDuration(startDate, endDate);
        String requestDate = convertTimestampToDateTime(Timestamp.from(Instant.now()));
        String formattedStartDate = convertTimestampToDate(startDate);
        String formattedEndDate = convertTimestampToDate(endDate);
        String formattedWorkPrice = formatNumberWithCommas((Integer) params.get("workPrice"));
        String siteAddress = plan.getAddress();
        String materialNames = materialList.stream()
                .map(serial -> materialRepository.findByMaterialSerial(serial).getMaterialName())
                .collect(Collectors.joining(", "));
        String message = String.format(
                "\n                ✨ 계약서 수정 요청! ✨\n\n" +
                        "    👷‍♂️ 시공자: %s\n" +
                        "    👩‍🦰 고객: %s\n" +
                        "    👏 요청 일자: %s\n" +
                        "    💵 작업 가격: %s원\n" +
                        "    🏠 출장 주소: %s\n" +
                        "    📅 작업 기간: %s ~ %s(%d일)\n" +
                        "    🛠 자재 목록: %s",
                workerName, customerName, requestDate, formattedWorkPrice, siteAddress,
                formattedStartDate, formattedEndDate, totalDuration, materialNames
        );

        ChatMessageRequestDTO contractMsg = ChatMessageRequestDTO.builder()
                .type(MessageType.CONTRACT)
                .chatroomSerial(chatroomSerial)
                .userSerial(userSerial)
                .chatMessageContent(message)
                .isFile(false)
                .originalFileName("")
                .isContract(true).build();
        chatMessageService.sendMessage(contractMsg, userSerial, userRepository.findByUserSerial(userSerial).getRole());

        return contractRequestDTO;
    }

    @Transactional
    public List<ContractRequestDTO> getContractLogService(int userSerial, int chatroomSerial, Map<String, Object> params) {
        Chatroom chatroom = chatroomRepository.findByChatroomSerial(chatroomSerial);
        User user = userRepository.findByUserSerial(userSerial);

        if((chatroom.getCuser().getUserSerial() != user.getUserSerial()) && (chatroom.getWuser().getUserSerial() != user.getUserSerial())) {
            throw new UnauthorizedUserException("조회할 권한이 없습니다.");
        }

        Customer customer = customerRepository.findByUserSerial(chatroom.getCuser());
        Plan plan = planRepository.findByCustomerSerialAndIsActive(customer, 1);
        List<Work> work = workRepository.findByPlanSerialAndFieldNameAndStatus(plan, chatroom.getFieldName(), "confirmed");

        if(work.size() != 1) {
            throw new DuplicateContractException("confirmed 상태인 요청이 하나가 아닙니다.");
        }

        Pageable pageable = PageRequest.of(Integer.parseInt((String) params.get("pgno")), Integer.parseInt((String) params.get("spp")));
        Page<Request> asPage = requestRepository.findByWorkSerialAndRequestStatusOrderByRequestDateDesc(work.get(0), "accepted", pageable);

        List<ContractRequestDTO> contractRequestDTOList = new ArrayList<>();

        for(Request request: asPage.getContent()) {
            ContractRequestDTO contractRequestDTO = ContractRequestDTO.builder()
                    .requestType(request.getRequestType())
                    .requestStatus(request.getRequestStatus())
                    .senderName(request.getSender().getUserName())
                    .receiverName(request.getReceiver().getUserName())
                    .requestComment(request.getRequestComment())
                    .requestDate(convertTimestamp(request.getRequestDate()))
                    .requestSerial(request.getRequestSerial())
                    .build();

            contractRequestDTOList.add(contractRequestDTO);

        }

        return contractRequestDTOList;
    }

    @Transactional
    public ContractRequestDTO deleteContractRequestService(int userSerial, int chatroomSerial, Map<String, Object> params) {
        User user = userRepository.findByUserSerial(userSerial);
        User sender, receiver;

        Chatroom chatroom = chatroomRepository.findByChatroomSerial(chatroomSerial);
        Customer customer = customerRepository.findByUserSerial(chatroom.getCuser());

        Plan plan = planRepository.findByCustomerSerialAndIsActive(customer, 1);

        if(chatroom.getCuser().getUserSerial() == user.getUserSerial()) {
            sender = chatroom.getCuser();
            receiver = chatroom.getWuser();
        } else if(chatroom.getWuser().getUserSerial() == user.getUserSerial()) {
            sender = chatroom.getWuser();
            receiver = chatroom.getCuser();
        } else {
            throw new UnauthorizedUserException("파기 요청 권한이 없습니다.");
        }

        List<Work> originalWork = workRepository.findByPlanSerialAndFieldNameAndStatus(plan, chatroom.getFieldName(), "confirmed");

        if(originalWork.size() != 1) {
            throw new DuplicateContractException("confirmed 상태인 요청이 하나가 아닙니다.");
        }

        List<Work> awaitingWork = workRepository.findByPlanSerialAndFieldNameAndStatus(originalWork.get(0).getPlanSerial(), originalWork.get(0).getFieldName(), "awaiting");

        if(!awaitingWork.isEmpty()) {
            throw new DuplicateContractException("이전 요청을 먼저 처리해주세요.");
        }

        Timestamp curDate = new Timestamp(System.currentTimeMillis());

        Request request = Request.builder()
                .requestComment((String) params.get("requestComment"))
                .workSerial(originalWork.get(0))
                .receiver(receiver)
                .sender(sender)
                .requestDate(curDate)
                .requestStatus("pending")
                .requestType("delete")
                .build();

        requestRepository.save(request);

        ContractRequestDTO contractRequestDTO = ContractRequestDTO.builder()
                .requestSerial(request.getRequestSerial())
                .requestDate(convertTimestamp(request.getRequestDate()))
                .senderName(request.getSender().getUserName())
                .receiverName(request.getReceiver().getUserName())
                .requestComment(request.getRequestComment())
                .requestStatus(request.getRequestStatus())
                .requestType(request.getRequestType())
                .build();

        ChatMessage currMsg = chatMessageRepository.findByChatroomSerialAndUserSerialAndFileType(chatroomSerial, userSerial, MessageType.CONTRACT);
        currMsg.setFileType(MessageType.CONTRACT_REJECTED);
        chatMessageRepository.save(currMsg);
        return contractRequestDTO;
    }

    //timestamp -> String
    public String convertTimestamp(Timestamp timestamp) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        return timestamp.toLocalDateTime().format(formatter);
    }

    //String -> timestamp
    private Timestamp convertStringToTimestamp(String dateString) {
        LocalDateTime localDateTime = LocalDateTime.parse(dateString + "T00:00:00");
        return Timestamp.valueOf(localDateTime);
    }

    //공사기간 계산
    public static int calculateTotalDuration(Timestamp startDate, Timestamp endDate) {
        long timeDifference = endDate.getTime() - startDate.getTime() + 1;
        long dayDifference = timeDifference / (1000 * 3600 * 24);

        return (int) Math.ceil(dayDifference);
    }

    // Timestamp를 yyyy.MM.dd 형식의 문자열로 변환
    public String convertTimestampToDate(Timestamp timestamp) {
        if (timestamp == null) {
            return null; // 또는 적절한 기본값을 반환할 수 있습니다.
        }

        // LocalDateTime 객체로 변환
        LocalDateTime localDateTime = timestamp.toLocalDateTime();

        // 원하는 포맷으로 DateTimeFormatter 설정
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");

        // LocalDateTime을 포맷팅하여 문자열로 변환
        return localDateTime.format(formatter);
    }

    // Timestamp를 yyyy.MM.dd HH:mm 형식의 문자열로 변환
    public String convertTimestampToDateTime(Timestamp timestamp) {
        if (timestamp == null) {
            return null; // 또는 적절한 기본값을 반환할 수 있습니다.
        }

        // LocalDateTime 객체로 변환
        LocalDateTime localDateTime = timestamp.toLocalDateTime();

        // 원하는 포맷으로 DateTimeFormatter 설정
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");

        // LocalDateTime을 포맷팅하여 문자열로 변환
        return localDateTime.format(formatter);
    }

    //format workprice with commas
    public static String formatNumberWithCommas(Integer number) {
        if (number == null) {
            return "0";
        }

        // NumberFormat 객체를 사용하여 천 단위 구분 기호를 포함하여 포맷
        NumberFormat numberFormat = NumberFormat.getInstance(Locale.KOREA);
        return numberFormat.format(number);
    }

    //getChatroomSerial
    public int getChatroomSerial(Request request, String fieldName) {
        int chatroomSerial = -1;
        User cuser = request.getSender().getRole().equals("customer") ? request.getSender(): request.getReceiver();
        User wuser = request.getSender().getRole().equals("worker") ? request.getSender(): request.getReceiver();
        chatroomSerial = chatroomRepository.findByCuserAndWuserAndStatusAndFieldName(cuser, wuser, Status.ACTIVE, fieldName).getChatroomSerial();

        return chatroomSerial;
    }
}
