package com.example.zipplz_be.Chatting.service;

import com.example.zipplz_be.Chatting.dto.*;
import com.example.zipplz_be.Chatting.entity.ChatMessage;
import com.example.zipplz_be.Chatting.entity.Chatroom;
import com.example.zipplz_be.Chatting.exception.CannotCreateChatroomAloneException;
import com.example.zipplz_be.Chatting.exception.ChatroomForbiddenException;
import com.example.zipplz_be.Chatting.exception.ChatroomNotFoundException;
import com.example.zipplz_be.Chatting.repository.ChatroomRepository;
import com.example.zipplz_be.Mongodb.repository.ChatMessageRepository;
import com.example.zipplz_be.Redis.repository.RedisRepository;
import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.Global.entity.Status;
import com.example.zipplz_be.Global.repository.FieldRepository;
import com.example.zipplz_be.Global.repository.LocalRepository;
import com.example.zipplz_be.Global.repository.MessageFileRelationRepository;
import com.example.zipplz_be.Portfolio.repository.PortfolioRepository;
import com.example.zipplz_be.Portfolio.service.CustomerReviewService;
import com.example.zipplz_be.Schedule.repository.PlanRepository;
import com.example.zipplz_be.User.entity.Customer;
import com.example.zipplz_be.User.entity.User;
import com.example.zipplz_be.User.entity.Worker;
import com.example.zipplz_be.User.repository.CustomerRepository;
import com.example.zipplz_be.User.repository.UserRepository;
import com.example.zipplz_be.User.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ChatroomServiceImpl implements ChatroomService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final ChatroomRepository chatroomRepository;
    private final RedisRepository redisRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final WorkerRepository workerRepository;

    private static final Map<String, Integer> CONSTRUCTION_FIELDS = Map.ofEntries(
            Map.entry("기타", 0), Map.entry("철거", 1), Map.entry("설비", 2),
            Map.entry("샷시", 3), Map.entry("목공", 4), Map.entry("전기", 5),
            Map.entry("욕실", 6), Map.entry("타일", 7), Map.entry("마루", 8),
            Map.entry("도배", 9), Map.entry("가구", 10)
    );
    private static final Map<Integer, String> SIDO_NAMES = Map.ofEntries(
            Map.entry(1, "서울"), Map.entry(2, "인천"), Map.entry(3, "대전"),
            Map.entry(4, "대구"), Map.entry(5, "광주"), Map.entry(6, "부산"),
            Map.entry(7, "울산"), Map.entry(8, "세종특별자치시"), Map.entry(31, "경기도"),
            Map.entry(32, "강원도"), Map.entry(33, "충청북도"), Map.entry(34, "충정남도"),
            Map.entry(35, "경상북도"), Map.entry(36, "경상남도"), Map.entry(37, "전라북도"),
            Map.entry(38, "전라남도"), Map.entry(39, "제주도")
    );
    private final PortfolioRepository portfolioRepository;
    private final FieldRepository fieldRepository;
    private final CustomerReviewService customerReviewService;
    private final MessageFileRelationRepository messageFileRelationRepository;
    private final LocalRepository localRepository;
    private final PlanRepository planRepository;

    @Override
    public int createChatroom(int userSerial, CreateChatroomDTO createChatroomDTO) {

        if (createChatroomDTO.getAnotherUserSerial() == userSerial) {
            throw new CannotCreateChatroomAloneException("자기 자신과의 채팅방은 생성할 수 없습니다.");
        }
        if (!userRepository.existsByUserSerial(userSerial) || !userRepository.existsByUserSerial(createChatroomDTO.getAnotherUserSerial())) {
            throw new UsernameNotFoundException("해당 유저가 존재하지 않습니다.");
        }

        User user = userRepository.findByUserSerial(userSerial);
        User anotherUser = userRepository.findByUserSerial(createChatroomDTO.getAnotherUserSerial());

        User cUser = customerRepository.existsByUserSerial(user) ? user : anotherUser;
        User wUser = customerRepository.existsByUserSerial(user) ? anotherUser : user;
        String fieldName = createChatroomDTO.getField();

        if (chatroomRepository.existsByStatusAndCuserAndWuserAndFieldName(Status.ACTIVE, cUser, wUser, fieldName)) {
            Chatroom savedChatroom =chatroomRepository.findByCuserAndWuserAndStatusAndFieldName(cUser, wUser, Status.ACTIVE, fieldName);
            return savedChatroom.getChatroomSerial();
        }

        Chatroom newChatroom = Chatroom.builder()
                .cuser(cUser)
                .wuser(wUser)
                .fieldName(fieldName).build();
        chatroomRepository.save(newChatroom);

        return newChatroom.getChatroomSerial();
    }

    @Override
    public List<ChatroomListDTO> getChatroomList(int userSerial, String role, Pageable pageable) {

        // 1. 사용자 userSerial로 사용자 목록을 페이지네이션하여 조회
        User user = userRepository.findByUserSerial(userSerial);
        Page<Chatroom> chatroomPage;
        if (role.equals("customer")) {
            chatroomPage = (Page<Chatroom>) chatroomRepository.findAllByCuserAndStatus(user, Status.ACTIVE, pageable);
        } else {
            chatroomPage = (Page<Chatroom>) chatroomRepository.findAllByWuserAndStatus(user, Status.ACTIVE, pageable);
        }

        // 2. 조회된 결과를 스트림으로 변환
        Stream<Chatroom> chatroomStream = chatroomPage.getContent().stream();

        // 3. 각 Chatroom 객체를 ChatroomListDTO 객체로 변환
        Stream<ChatroomListDTO> chatroomListDtoStream = chatroomStream.map(chatroom -> createChatroomListDto(chatroom, userSerial));

        // 4. 변환된 ChatroomListDTO 객체들을 리스트로 수집
        return chatroomListDtoStream.collect(Collectors.toList());
    }

    private ChatroomListDTO createChatroomListDto(Chatroom chatroom, int userSerial) {
        int chatroomSerial = chatroom.getChatroomSerial();
        String roomSerial = Integer.toString(chatroomSerial);
        int unReadMessageCount = redisRepository.getChatRoomMessageCount(roomSerial, userSerial);

        Optional<ChatMessage> lastMessageOpt = chatMessageRepository
                .findFirstByChatroomSerialOrderByCreatedAtDesc(chatroomSerial);

        String lastMessage = lastMessageOpt.map(ChatMessage::getChatMessageContent).orElse("채팅방이 생성되었습니다.");

        String fieldName = chatroom.getFieldName();
        String workerName = chatroom.getWuser().getUserName();
        String customerName = chatroom.getCuser().getUserName();
        Worker worker = workerRepository.findByUserSerial(chatroom.getWuser());
        boolean isCertificated = (worker.getCertificatedBadge() == 1);
        double temperature = customerReviewService.calculateAverageStars(portfolioRepository.findByWorkerAndFieldId(worker, fieldRepository.findByFieldName(fieldName)));
        File otherUserImg = userSerial == chatroom.getWuser().getUserSerial() ?
                chatroom.getCuser().getFileSerial() : chatroom.getWuser().getFileSerial();

        LocalDateTime lastTime = lastMessageOpt.map(ChatMessage::getCreatedAt).orElse(LocalDateTime.now());

        ChatroomListDTO chatroomDTO = new ChatroomListDTO(roomSerial, lastMessage, fieldName, workerName, customerName, isCertificated, temperature, otherUserImg, lastTime, unReadMessageCount);
        System.out.println(chatroomDTO);
        return chatroomDTO;
    }

    @Override
    public ChatroomDetailDTO getChatroomDetail(int chatroomSerial, int userSerial) {
        Chatroom chatroom = chatroomRepository.findByChatroomSerial(chatroomSerial);
        boolean isOtherUserCustomer =
                userSerial == chatroom.getWuser().getUserSerial()? true : false;
        User otherUser =
                userSerial == chatroom.getWuser().getUserSerial()? chatroom.getCuser() : chatroom.getWuser();
        int otherUserSerial = otherUser.getUserSerial();
        String name = otherUser.getUserName();
        String location;
        String fieldName;
        boolean isCertificated;
        if (isOtherUserCustomer) {
            Customer customer = customerRepository.findByUserSerial(otherUser);
            fieldName = chatroomRepository.findByChatroomSerial(chatroomSerial).getFieldName();
            isCertificated = false;
            if (!planRepository.existsByCustomerSerialAndIsActive(customer, 1)) {
                location = "";
            } else {
                location = planRepository.findByCustomerSerialAndIsActive(customer, 1).getAddress();
            }
        } else {
            fieldName = chatroomRepository.findByChatroomSerial(chatroomSerial).getFieldName();
            isCertificated = workerRepository.findByUserSerial(otherUser).getCertificatedBadge() == 1? true : false;
            if (!localRepository.existsByUserSerial(otherUser)) {
                location = "";
            } else {
                int sido = localRepository.findFirstByUserSerial(otherUser).getSidoCode();
                location = SIDO_NAMES.get(sido);
            }
        }

        OtherUserInfoDTO otherUserInfo = OtherUserInfoDTO.builder()
                .userSerial(otherUserSerial)
                .name(name)
                .location(location)
                .fieldName(fieldName)
                .isCertificated(isCertificated)
                .image(otherUser.getFileSerial()).build();

        return ChatroomDetailDTO.builder()
                        .otherUser(otherUserInfo)
                        .chatMessages(getPreviousMessage(chatroomSerial, userSerial)).build();
    }

    @Override
    public String getOtherUserName(int chatroomSerial, int userSerial) {
        Chatroom chatroom = chatroomRepository.findByChatroomSerial(chatroomSerial);

        User otherUser =
                userSerial == chatroom.getWuser().getUserSerial()? chatroom.getCuser() : chatroom.getWuser();

        return otherUser.getUserName();
    }

    @Override
    public List<ChatMessageResponseDTO> getPreviousMessage(int chatroomSerial, int userSerial) {
        if (!chatroomRepository.existsByChatroomSerialAndStatus(chatroomSerial, Status.ACTIVE)) {
            throw new ChatroomNotFoundException("해당 채팅방이 존재하지 않습니다.");
        }
        Chatroom chatroom = chatroomRepository.findByChatroomSerialAndStatus(chatroomSerial, Status.ACTIVE);

        boolean isUserInChatroom = ((chatroom.getCuser().getUserSerial() == userSerial)
                || (chatroom.getWuser().getUserSerial() == userSerial));

        if (!isUserInChatroom) throw new ChatroomForbiddenException("잘못된 접근입니다.");

        List<ChatMessage> messages = chatMessageRepository.findAllByChatroomSerial(chatroomSerial);
        Collections.sort(messages);
        List<ChatMessageResponseDTO> previousMessages = new ArrayList<>();
        for (ChatMessage message : messages) {
            previousMessages.add(new ChatMessageResponseDTO(message));
        }

        return previousMessages;
    }

    @Override
    public void deleteChatroom(int chatroomSerial, int userSerial) {
        if (!chatroomRepository.existsByChatroomSerialAndStatus(chatroomSerial, Status.ACTIVE)) {
            throw new ChatroomNotFoundException("해당 채팅방이 존재하지 않습니다.");
        }
        Chatroom chatroom = chatroomRepository.findByChatroomSerialAndStatus(chatroomSerial, Status.ACTIVE);
        chatroomRepository.save(chatroom.inActive());
    }

//    public double calculateTemperature(Worker worker, String fieldName) {
//        Field field = fieldRepository.findByFieldName(fieldName);
//        Portfolio portfolio = portfolioRepository.findByWorkerAndFieldId(worker, field);
//        customerReviewRepository.findAllByPortfolioSerial(portfolio);
//    }
}
