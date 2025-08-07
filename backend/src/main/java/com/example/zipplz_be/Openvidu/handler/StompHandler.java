package com.example.zipplz_be.Openvidu.handler;

import com.example.zipplz_be.Redis.repository.RedisRepository;
import com.example.zipplz_be.JWT.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {
    private final RedisRepository redisRepository;
    private final JWTUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        String jwtToken = accessor.getFirstNativeHeader("X-AUTH-TOKEN");

        if (StompCommand.CONNECT == accessor.getCommand()) {
            int userId = jwtUtil.getUserSerial(jwtToken);
            String sessionId = (String) message.getHeaders().get("simpSessionId");
            redisRepository.saveMyInfo(sessionId, userId);
            System.out.println("connected!!!!!!!!!!!!!!!!!!!11");
        }
        else if (StompCommand.DISCONNECT == accessor.getCommand()) {
            String sessionId = (String) message.getHeaders().get("simpSessionId");

            if (redisRepository.existMyInfo(sessionId)) {
                int userId = redisRepository.getMyInfo(sessionId);
                // 채팅방 퇴장 정보 저장
                if (redisRepository.existChatRoomUserInfo(userId)) {
                    redisRepository.exitUserEnterRoomSerial(userId);
                }
                redisRepository.deleteMyInfo(sessionId);
                System.out.println("disconnected!!!!!!!!!!!!!!");
            }
        }
        return message;
    }
}