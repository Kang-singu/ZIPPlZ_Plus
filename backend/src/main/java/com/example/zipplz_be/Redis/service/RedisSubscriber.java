package com.example.zipplz_be.Redis.service;

import com.example.zipplz_be.Chatting.dto.ChatMessageRequestDTO;
import com.example.zipplz_be.Chatting.dto.ChatMessageResponseDTO;
import com.example.zipplz_be.Chatting.dto.UnreadMessageCount;
import com.example.zipplz_be.Chatting.exception.ChatMessageNotFoundException;
import com.example.zipplz_be.Global.entity.MessageType;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class RedisSubscriber implements MessageListener {

    private final ObjectMapper objectMapper;
    private final RedisTemplate redisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;

    /*
    Redis에서 메세지가 발행(publish)되면 대기하고 있던 onMessage가 해당 메세지를 받아 처리
     */
    @Override
    public void onMessage(Message message, byte[] pattern) {
       try {
           // redis에서 발행된 데이터를 받아 역직렬화
           String publishMessage = (String) redisTemplate.getStringSerializer().deserialize(message.getBody());

           // ChatMessage 객체로 맵핑
           ChatMessageRequestDTO roomMessage = objectMapper.readValue(publishMessage, ChatMessageRequestDTO.class);
           System.out.println("roomMessage from onMessage (RedisSubscriber) => " + roomMessage.toString());

           // getType이 TALK, UNREAD_MESSAGE_COUNT_ALARM 일 경우
           if (roomMessage.getType() != null) {
               if (roomMessage.getType() == MessageType.UNREAD_MESSAGE_COUNT_ALARM) {
                   // 안읽은 메세지일 경우
                   UnreadMessageCount messageCount = new UnreadMessageCount(roomMessage);
                   int otherUserSerial = roomMessage.getOtherUserSerial();
                   // websocket 구독자에게 안읽은 메세지 반환
                   messagingTemplate.convertAndSend("/sub/chat/unread/" + otherUserSerial, messageCount);
               } else {
                   // 일대일 채팅일 경우
                   ChatMessageResponseDTO chatMessageResponseDTO = new ChatMessageResponseDTO(roomMessage);
                   messagingTemplate.convertAndSend("/sub/chat/room/" + roomMessage.getChatroomSerial(), chatMessageResponseDTO);
               }
           }
       } catch (Exception e) {
           throw new ChatMessageNotFoundException("해당 채팅 메시지가 없습니다.");
        }
    }
}
