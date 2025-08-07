package com.example.zipplz_be.Chatting.service;

import com.example.zipplz_be.Chatting.dto.ChatMessageRequestDTO;
import org.springframework.stereotype.Service;

@Service
public interface ChatMessageService {

    void sendMessage(ChatMessageRequestDTO chatMessageRequestDTO, int userSerial, String role);

    void enter(int userSerial, int chatroomSerial);
}
