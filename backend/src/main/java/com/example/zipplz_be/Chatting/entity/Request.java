package com.example.zipplz_be.Chatting.entity;

import com.example.zipplz_be.Schedule.entity.Work;
import com.example.zipplz_be.User.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="request_serial")
    int requestSerial;

    @ManyToOne
    @JoinColumn(name="work_serial")
    Work workSerial;

    @Temporal(TemporalType.TIMESTAMP)
    private Timestamp requestDate;

    @Column(name="request_type")
    String requestType;

    @ManyToOne
    @JoinColumn(name = "sender", referencedColumnName = "user_serial")
    User sender;

    @ManyToOne
    @JoinColumn(name = "receiver", referencedColumnName = "user_serial")
    User receiver;

    @Column(name="request_status")
    String requestStatus;

    @Column(name="request_comment")
    String requestComment;

    @Builder
    public Request(String requestComment, Work workSerial, Timestamp requestDate, String requestType, User sender, String requestStatus, User receiver) {
        this.requestComment = requestComment;
        this.workSerial = workSerial;
        this.requestDate = requestDate;
        this.requestType = requestType;
        this.sender = sender;
        this.requestStatus = requestStatus;
        this.receiver = receiver;
    }
}
