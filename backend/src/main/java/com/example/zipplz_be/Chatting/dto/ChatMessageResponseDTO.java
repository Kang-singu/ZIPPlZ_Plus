package com.example.zipplz_be.Chatting.dto;

import com.example.zipplz_be.Chatting.entity.ChatMessage;
import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.Global.entity.MessageType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageResponseDTO {
    private int userSerial;
    private String userName;
    private String chatMessageContent;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime createdAt;
    private MessageType fileType;
    private File file;
    private boolean isContract;

    public ChatMessageResponseDTO(ChatMessageRequestDTO request) {
        this.userSerial = request.getUserSerial();
        this.userName = request.getUserName();
        this.chatMessageContent = request.getChatMessageContent();
        this.fileType = request.getType();
        this.createdAt = LocalDateTime.now();
        this.file = null;
        this.isContract = request.isContract();
    }

    public ChatMessageResponseDTO(ChatMessage chatMessage) {
        this.userSerial = chatMessage.getUserSerial();
        this.userName = chatMessage.getUserName();
        this.chatMessageContent = chatMessage.getChatMessageContent();
        this.createdAt = chatMessage.getCreatedAt();
        this.fileType = chatMessage.getFileType();
        this.file = chatMessage.getFile();
        this.isContract = chatMessage.isContract();
    }
}
