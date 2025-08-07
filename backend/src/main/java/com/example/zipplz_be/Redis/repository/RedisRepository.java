package com.example.zipplz_be.Redis.repository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class RedisRepository {
    private static final String ENTER_INFO = "ENTER_INFO";
    private static final String USER_INFO = "USER_INFO";
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * "ENTER_INFO", chatroomSerial, userSerial (유저가 입장한 채팅방 정보)
     */
    private HashOperations<String, Integer, Integer> chatroomInfo;

    /**
     * 채팅방 마다 유저가 읽지 않은 메세지 갯수 저장
     * 1:1 채팅에서 사용
     * chatroomSerial, userSerial, 안 읽은 메세지 갯수
     */
    private HashOperations<String, Integer, Integer> chatroomUnReadMessageInfo;

    /**
     * 상대 정보는 sessionId로 저장, 나의 정보는 userId에 저장
     * "USER_INFO", sessionId, userId
     */
    private HashOperations<String, String, Integer> userInfo;

    @PostConstruct
    private void init() {
        chatroomInfo = redisTemplate.opsForHash();
        chatroomUnReadMessageInfo = redisTemplate.opsForHash();
        userInfo = redisTemplate.opsForHash();
    }

    // step1
    // 유저가 입장한 채팅방ID와 유저 세션ID 맵핑 정보 저장
    public void userEnterRoomInfo(Integer userSerial, Integer chatroomSerial) {
        chatroomInfo.put(ENTER_INFO, userSerial, chatroomSerial);
    }

    // 사용자가 채팅방에 입장해 있는지 확인
    public boolean existChatRoomUserInfo(Integer userSerial) {
        return chatroomInfo.hasKey(ENTER_INFO, userSerial);
    }

    // 사용자가 특정 채팅방에 입장해 있는지 확인
    public boolean existUserRoomInfo(Integer chatroomSerial, Integer userSerial) {
        return getUserEnterRoomId(userSerial).equals(chatroomSerial);
    }

    // 사용자가 입장해 있는 채팅방ID 조회
    public Integer getUserEnterRoomId(Integer userSerial) {
        return chatroomInfo.get(ENTER_INFO, userSerial);
    }

    // 사용자가 채팅방 퇴장
    public void exitUserEnterRoomSerial(Integer userSerial) {
        chatroomInfo.delete(ENTER_INFO, userSerial);
    }

    // step2
    // 채팅방에서 사용자가 읽지 않은 메세지의 갯수 초기화
    public void initChatRoomMessageInfo(String chatroomSerial, Integer userSerial) {
        chatroomUnReadMessageInfo.put(chatroomSerial, userSerial, 0);
    }

    // 채팅방에서 사용자가 읽지 않은 메세지의 갯수 추가
    public void addChatRoomMessageCount(String chatroomSerial, Integer userSerial) {
        Integer count = chatroomUnReadMessageInfo.get(chatroomSerial, userSerial);
        chatroomUnReadMessageInfo.put(chatroomSerial, userSerial, (count != null ? count : 0) + 1);
    }

    // 채팅방 안읽은 갯수 가져오기
    public int getChatRoomMessageCount(String chatroomSerial, Integer userSerial) {
        Integer count = chatroomUnReadMessageInfo.get(chatroomSerial, userSerial);
        return count != null ? count : 0;
    }

    // step3
    // 나의 대화상대 정보 저장
    public void saveMyInfo(String sessionId, Integer userSerial) {
        userInfo.put(USER_INFO, sessionId, userSerial);
    }

    public boolean existMyInfo(String sessionId) {
        return userInfo.hasKey(USER_INFO, sessionId);
    }

    public Integer getMyInfo(String sessionId) {
        return userInfo.get(USER_INFO, sessionId);
    }

    // 나의 대화상대 정보 삭제
    public void deleteMyInfo(String sessionId) {
        userInfo.delete(USER_INFO, sessionId);
    }
}

