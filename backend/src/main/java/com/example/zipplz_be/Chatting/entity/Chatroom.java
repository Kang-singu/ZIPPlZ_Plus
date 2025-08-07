package com.example.zipplz_be.Chatting.entity;

import com.example.zipplz_be.Global.entity.Status;
import com.example.zipplz_be.User.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Chatroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="chatroom_serial")
    private int chatroomSerial;
    @ManyToOne
    @JoinColumn(name="c_user_serial")
    private User cuser;
    @ManyToOne
    @JoinColumn(name="w_user_serial")
    private User wuser;
    @Column(name="field_name")
    private String fieldName;
    @Column(name="chatroom_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Timestamp chatroomDate;
    @Column(name="session_id")
    private String sessionId;
    private Status status;

    @Builder
    Chatroom(User cuser, User wuser, String fieldName) {
        this.cuser = cuser;
        this.wuser = wuser;
        this.fieldName = fieldName;
        this.status = Status.ACTIVE;
    }

    public Chatroom inActive() {
        this.status = Status.INACTIVE;
        return this;
    }
}
