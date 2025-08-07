package com.example.zipplz_be.Mypage.service;

import com.example.zipplz_be.Mypage.entity.Notification;
import com.example.zipplz_be.Mypage.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public int addNotification(int userSerial, String notificationComment, LocalDateTime notificationDate, int isChecked) {
        return notificationRepository.addNotification(userSerial, notificationComment, notificationDate, isChecked);
    }

    @Override
    public List<Notification> getNotificationList(int userSerial) {
        return notificationRepository.getNotificationList(userSerial);
    }
}
