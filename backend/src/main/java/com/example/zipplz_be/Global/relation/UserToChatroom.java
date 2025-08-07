package com.example.zipplz_be.Global.relation;

import com.example.zipplz_be.Chatting.entity.Chatroom;
import com.example.zipplz_be.User.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@IdClass(UserToChatroom.class)
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserToChatroom {
    @Id
    @ManyToOne
    @JoinColumn(name= "chatroom_serial")
    private Chatroom chatroomSerial;

    @Id
    @ManyToOne
    @JoinColumn(name = "user_serial")
    private User userSerial;

    private String token;

}
