package com.example.zipplz_be.Board.dto;

import java.time.LocalDateTime;

public interface CommentJoinDTO {
    int getCommentSerial();
    int getBoardSerial();
    int getUserSerial();
    String getCommentContent();
    LocalDateTime getCommentDate();
    int getParentCommentSerial();
    int getOrderNumber();
    int getIsDeleted();
    String getNickName();
    String getUserName();
    String getSaveFile();
}
