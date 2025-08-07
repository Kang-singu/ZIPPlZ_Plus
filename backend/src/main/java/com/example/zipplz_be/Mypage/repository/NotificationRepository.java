package com.example.zipplz_be.Mypage.repository;

import com.example.zipplz_be.Mypage.entity.Notification;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO Notification(user_serial, notification_comment, notification_date, is_checked) " +
            "VALUES(:userSerial, " +
            ":notificationComment, " +
            ":notificationDate, " +
            ":isChecked)", nativeQuery = true)
    int addNotification(
            @Param("userSerial") int userSerial,
            @Param("notificationComment") String notificationComment,
            @Param("notificationDate") LocalDateTime notificationDate,
            @Param("isChecked") int isChecked);

    @Query(value = "SELECT * " +
            "FROM Notification " +
            "WHERE user_serial = :userSerial", nativeQuery = true)
    List<Notification> getNotificationList(@Param("userSerial") int userSerial);
}
