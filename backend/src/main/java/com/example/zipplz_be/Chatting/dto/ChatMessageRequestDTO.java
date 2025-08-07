package com.example.zipplz_be.Chatting.dto;

import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.Global.entity.MessageType;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageRequestDTO {

    private int chatroomSerial; // 방 번호
    private String chatMessageContent; // 메세지
    private int userSerial; // 발신자
    private String userName; // 발신자 이름
    private int otherUserSerial; // 수신자
    private MessageType type;
    private int count; // 안읽은 메세지 개수
    private Boolean isFile;
    private String originalFileName; // 파일 전송 시
    private File file;
    private boolean isContract;

    // 안읽은 메세지 처리를 위한 생성자
    public ChatMessageRequestDTO(ChatMessageRequestDTO chatMessageRequestDTO, int count) {
        this.type = MessageType.UNREAD_MESSAGE_COUNT_ALARM;
        this.chatroomSerial = chatMessageRequestDTO.getChatroomSerial();
        this.otherUserSerial = chatMessageRequestDTO.getOtherUserSerial();
        this.count = count;
    }

    @Override
    public String toString() {
        return "ChatMessageRequestDTO{" +
                "chatroomSerial=" + chatroomSerial +
                ", chatMessageContent='" + chatMessageContent + '\'' +
                ", userSerial=" + userSerial +
                ", userName='" + userName + '\'' +
                ", otherUserSerial=" + otherUserSerial +
                ", type=" + type +
                ", count=" + count +
                ", isFile=" + isFile +
                '}';
    }
}
