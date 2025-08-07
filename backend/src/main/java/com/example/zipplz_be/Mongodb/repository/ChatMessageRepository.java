package com.example.zipplz_be.Mongodb.repository;

import com.example.zipplz_be.Chatting.entity.ChatMessage;
import com.example.zipplz_be.Global.entity.MessageType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    List<ChatMessage> findAllByChatroomSerial(int chatroomSerial);

    Optional<ChatMessage> findFirstByChatroomSerialOrderByCreatedAtDesc(int chatroomSerial);

    Optional<ChatMessage> findById(String id);

    boolean existsById(String id);

    ChatMessage findByChatroomSerialAndUserSerialAndFileType(int chatroomSerial, int userSerial, MessageType fileType);
}
