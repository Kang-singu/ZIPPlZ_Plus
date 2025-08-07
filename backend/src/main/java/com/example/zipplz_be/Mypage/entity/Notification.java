package com.example.zipplz_be.Mypage.entity;

import com.example.zipplz_be.User.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="notification_serial")
    private int notificationSerial;
    @ManyToOne
    @JoinColumn(name="user_serial")
    private User userSerial;
    @Column(name="notification_comment")
    private String notificationComment;
    @Column(name="notification_date")
    private LocalDateTime notificationDate;
    @Column(name="is_checked")
    private int isChecked;
}
