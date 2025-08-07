package com.example.zipplz_be.Chatting.service;

import com.example.zipplz_be.Chatting.dto.ChatMessageRequestDTO;
import com.example.zipplz_be.Chatting.entity.ChatMessage;
import com.example.zipplz_be.Chatting.entity.Chatroom;
import com.example.zipplz_be.Chatting.exception.ChatroomNotFoundException;
import com.example.zipplz_be.Chatting.repository.ChatroomRepository;
import com.example.zipplz_be.Global.entity.MessageType;
import com.example.zipplz_be.Mongodb.repository.ChatMessageRepository;
import com.example.zipplz_be.Redis.repository.RedisRepository;
import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.File.repository.FileRepository;
import com.example.zipplz_be.Global.entity.Status;
import com.example.zipplz_be.Global.repository.MessageFileRelationRepository;
import com.example.zipplz_be.Redis.service.RedisPublisher;
import com.example.zipplz_be.S3.service.S3Service;
import com.example.zipplz_be.User.entity.User;
import com.example.zipplz_be.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService {

    private final UserRepository userRepository;
    private final ChatroomRepository chatroomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final RedisPublisher redisPublisher;
    private final ChannelTopic channelTopic;
    private final RedisRepository redisRepository;
    private final S3Service s3Service;
    private final FileRepository fileRepository;
    private final MessageFileRelationRepository messageFileRelationRepository;

    @Override
    public void sendMessage(ChatMessageRequestDTO chatMessageRequestDTO, int userSerial, String role) {
        User user = userRepository.findByUserSerial(userSerial);
        if (user == null) {
            throw new UsernameNotFoundException("해당 유저가 존재하지 않습니다.");
        }
        Chatroom chatroom = chatroomRepository.findByChatroomSerial(chatMessageRequestDTO.getChatroomSerial());
        if (chatroom == null) {
            throw new ChatroomNotFoundException("해당 채팅방이 존재하지 않습니다.");
        }

        ChatMessage chatMessage;
        File file;
        if (chatMessageRequestDTO.getIsFile()) {

            file = s3Service.uploadBase64File(chatMessageRequestDTO.getChatMessageContent(), chatMessageRequestDTO.getOriginalFileName());

            chatMessage = ChatMessage.builder()
                    .chatroomSerial(chatMessageRequestDTO.getChatroomSerial())
                    .userSerial(userSerial)
                    .userName(userRepository.findByUserSerial(userSerial).getUserName())
//                    .chatMessageContent(file.getFileName()) // return 받은 S3 file url
                    .chatMessageContent(chatMessageRequestDTO.getChatMessageContent())
                    .fileType(chatMessageRequestDTO.getType())
                    .file(file)
                    .isContract(chatMessageRequestDTO.isContract())
                    .build();
        } else {
            file = null;

            chatMessage = ChatMessage.builder()
                    .chatroomSerial(chatMessageRequestDTO.getChatroomSerial())
                    .userSerial(userSerial)
                    .userName(userRepository.findByUserSerial(userSerial).getUserName())
                    .chatMessageContent(chatMessageRequestDTO.getChatMessageContent())
                    .fileType(chatMessageRequestDTO.getType())
                    .file(file)
                    .isContract(chatMessageRequestDTO.isContract())
                    .build();
        }

        chatMessageRepository.save(chatMessage);
        chatMessageRequestDTO.setUserSerial(userSerial);
        chatMessageRequestDTO.setUserName(user.getUserName());
        chatMessageRequestDTO.setFile(file);

        int otherUserSerial;
        if (role.equals("customer")) {
            otherUserSerial = chatroom.getWuser().getUserSerial();
        } else {
            otherUserSerial = chatroom.getCuser().getUserSerial();
        }
        chatMessageRequestDTO.setOtherUserSerial(otherUserSerial);

        if (chatMessageRequestDTO.getType() != MessageType.UNREAD_MESSAGE_COUNT_ALARM) {
            redisPublisher.publish(channelTopic, chatMessageRequestDTO);
            updateUnReadMessageCount(chatMessageRequestDTO);
        }
    }



    // 안읽은 메세지 업데이트
    private void updateUnReadMessageCount(ChatMessageRequestDTO chatMessageRequestDTO) {
        int otherUserSerial = chatMessageRequestDTO.getOtherUserSerial();
        String chatroomSerial = String.valueOf(chatMessageRequestDTO.getChatroomSerial());
        if (!redisRepository.existChatRoomUserInfo(otherUserSerial) || !redisRepository.getUserEnterRoomId(otherUserSerial).equals(chatMessageRequestDTO.getChatroomSerial())) {
            redisRepository.addChatRoomMessageCount(chatroomSerial, otherUserSerial);
            int unReadMessageCount = redisRepository.getChatRoomMessageCount(chatroomSerial, otherUserSerial);
            ChatMessageRequestDTO messageRequest = new ChatMessageRequestDTO(chatMessageRequestDTO, unReadMessageCount);
            redisPublisher.publish(channelTopic, messageRequest);
        }
    }

    // 채팅방 입장
    @Override
    public void enter(int userSerial, int chatroomSerial) {
        if (!chatroomRepository.existsByChatroomSerialAndStatus(chatroomSerial, Status.ACTIVE)) {
            throw new ChatroomNotFoundException("해당 채팅방이 존재하지 않습니다.");
        }
        Chatroom chatroom = chatroomRepository.findByChatroomSerial(chatroomSerial);

        // 채팅방에 들어온 정보를 Redis에 저장
        redisRepository.userEnterRoomInfo(userSerial, chatroomSerial);
        redisRepository.initChatRoomMessageInfo(String.valueOf(chatroom.getChatroomSerial()), userSerial);
    }
}
