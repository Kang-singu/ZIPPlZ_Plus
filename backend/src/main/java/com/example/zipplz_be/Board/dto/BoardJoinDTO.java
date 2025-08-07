package com.example.zipplz_be.Board.dto;

import java.time.LocalDateTime;

public interface BoardJoinDTO {
    int getBoardSerial();
    int getBoardType();
    int getUserSerial();
    String getTitle();
    String getBoardContent();
    LocalDateTime getBoardDate();
    int getHit();
    String getNickname();
    String getUserName();
    String getSaveFile();
}
