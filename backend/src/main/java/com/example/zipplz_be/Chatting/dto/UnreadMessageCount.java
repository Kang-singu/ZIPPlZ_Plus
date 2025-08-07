package com.example.zipplz_be.Chatting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UnreadMessageCount {
    private int otherUserSerial;
    private int unreadCount;
    private int chatroomSerial;
    private String type;

    public UnreadMessageCount(ChatMessageRequestDTO roomMessage) {
        this.type = "UNREAD";
        this.otherUserSerial = roomMessage.getOtherUserSerial();
        this.chatroomSerial = roomMessage.getChatroomSerial();
        this.unreadCount = roomMessage.getCount();
    }
}
