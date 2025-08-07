package com.example.zipplz_be.Chatting.dto;

import com.example.zipplz_be.File.entity.File;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatroomListDTO {
    private String chatroomSerial;
    private String lastMessage;

    private String fieldName;
    private String workerName;
    private String customerName;
    private boolean isCertificated;
    private double temperature;

    private File otherUserImg;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    private int unreadCount;

    @Override
    public String toString() {
        return "ChatroomListDTO{" +
                "chatroomSerial='" + chatroomSerial + '\'' +
                ", lastMessage='" + lastMessage + '\'' +
                ", fieldName='" + fieldName + '\'' +
                ", workerName='" + workerName + '\'' +
                ", customerName='" + customerName + '\'' +
                ", isCertificated=" + isCertificated +
                ", createdAt=" + createdAt +
                ", unreadCount=" + unreadCount +
                '}';
    }
}
