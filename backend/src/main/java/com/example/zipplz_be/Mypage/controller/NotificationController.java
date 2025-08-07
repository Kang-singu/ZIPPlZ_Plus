package com.example.zipplz_be.Mypage.controller;

import com.example.zipplz_be.Global.dto.ResponseDTO;
import com.example.zipplz_be.Mypage.entity.Notification;
import com.example.zipplz_be.Mypage.service.NotificationService;
import com.example.zipplz_be.User.dto.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/notification")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/add")
    public ResponseEntity<ResponseDTO<Boolean>> addNotification(Authentication authentication, @RequestBody(required = false) Map<String, Object> params) {
        ResponseDTO<Boolean> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
            int user_serial = customUserDetails.getUserSerial();
            String notification_comment = (String) params.get("notification_comment");
            LocalDateTime notification_date = LocalDateTime.now();
            int is_checked = 0;

            int result = notificationService.addNotification(user_serial, notification_comment, notification_date, is_checked);
            if (result == 1 ) {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "알림 저장 완료", true);
            } else {
                status = HttpStatus.BAD_REQUEST;
                responseDTO = new ResponseDTO<>(status.value(), "알림 저장 실패");
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }

    @PostMapping("/list")
    public ResponseEntity<ResponseDTO<List<Notification>>> getNotificationList(Authentication authentication, @RequestBody(required = false) Map<String, Object> params) {
        ResponseDTO<List<Notification>> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
            int user_serial = customUserDetails.getUserSerial();
            List<Notification> list = notificationService.getNotificationList(user_serial);
            if (list == null) {
                status = HttpStatus.BAD_REQUEST;
                responseDTO = new ResponseDTO<>(status.value(), "알림 가져오기 실패");
            } else {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "알림 가져오기 완료", list);
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }
}
