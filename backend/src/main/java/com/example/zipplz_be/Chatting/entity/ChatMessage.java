package com.example.zipplz_be.Chatting.entity;

import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.Global.entity.MessageType;
import com.example.zipplz_be.Global.entity.BaseTimeEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Document(collection = "chat_messages")
public class ChatMessage extends BaseTimeEntity implements Comparable<ChatMessage> {

    @Id
    private String id;

    @JsonProperty("chatroom_serial")
    private int chatroomSerial;

    @JsonProperty("user_serial")
    private int userSerial;

    @JsonProperty("user_name")
    private String userName;

    @JsonProperty("chat_message_content")
    private String chatMessageContent;

    @JsonProperty("file_type")
    private MessageType fileType;

    @JsonProperty("file")
    private File file;

    @JsonProperty("is_contract")
    private boolean isContract;

    // 시간은 BaseTimeEntity에서 자동으로 컬럼 생성됨

    @Builder
    public ChatMessage(int chatroomSerial, int userSerial, String userName, String chatMessageContent, MessageType fileType, File file, boolean isContract) {
        this.chatroomSerial = chatroomSerial;
        this.userSerial = userSerial;
        this.userName = userName;
        this.chatMessageContent = chatMessageContent;
        this.fileType = fileType;
        this.file = file;
        this.isContract = isContract;
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "id='" + id + '\'' +
                ", chatroomSerial=" + chatroomSerial +
                ", userSerial=" + userSerial +
                ", userName='" + userName + '\'' +
                ", chatMessageContent='" + chatMessageContent + '\'' +
                ", fileType=" + fileType +
                '}';
    }

    @Override
    public int compareTo(ChatMessage o) {
        return this.getCreatedAt().compareTo(o.getCreatedAt());
    }
}
