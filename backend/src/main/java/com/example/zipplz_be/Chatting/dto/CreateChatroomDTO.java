package com.example.zipplz_be.Chatting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateChatroomDTO {
    private String field;
    private int anotherUserSerial;
}
