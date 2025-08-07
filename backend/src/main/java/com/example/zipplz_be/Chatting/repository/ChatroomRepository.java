package com.example.zipplz_be.Chatting.repository;

import com.example.zipplz_be.Chatting.entity.Chatroom;
import com.example.zipplz_be.Global.entity.Status;
import com.example.zipplz_be.User.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatroomRepository extends JpaRepository<Chatroom, Integer> {
    Chatroom findByChatroomSerial(int chatroomSerial);
    Chatroom findByChatroomSerialAndStatus(int chatroomSerial, Status active);

    Chatroom findBySessionId(String sessionId);

    Boolean existsByChatroomSerialAndStatus(int chatroomSerial, Status active);

    // 엔티티 필드에 맞는 메소드 정의
    Boolean existsByStatusAndCuserAndWuserAndFieldName(Status status, User cuser, User wuser, String fieldName);

    Chatroom findByCuserAndWuserAndStatusAndFieldName(User cuser, User wuser, Status active, String fieldName);

    Page<Chatroom> findAllByCuserAndStatus(User cuser, Status active, Pageable pageable);

    Page<Chatroom> findAllByWuserAndStatus(User wuser, Status active, Pageable pageable);
}
