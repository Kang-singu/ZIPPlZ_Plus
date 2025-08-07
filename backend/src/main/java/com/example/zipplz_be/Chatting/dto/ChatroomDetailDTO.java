package com.example.zipplz_be.Chatting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatroomDetailDTO {
    private OtherUserInfoDTO otherUser;
    private List<ChatMessageResponseDTO> chatMessages;
}
