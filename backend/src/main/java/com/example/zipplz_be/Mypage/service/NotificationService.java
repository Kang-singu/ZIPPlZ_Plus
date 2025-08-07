package com.example.zipplz_be.Mypage.service;

import com.example.zipplz_be.Mypage.entity.Notification;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationService {
    int addNotification(int userSerial, String notificationComment, LocalDateTime notificationDate, int isChecked);
    List<Notification> getNotificationList(int userSerial);
}