package com.example.zipplz_be.Board.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShowBoardListDTO {
    int board_serial;
    int board_type;
    int user_serial;
    String img;
    String title;
    String nickname;
    String user_name;
    String save_file;
    LocalDateTime board_date;
    int hit;
    int comment_cnt;
    int wish_cnt;

    public ShowBoardListDTO(BoardJoinDTO bjd, String img, int comment_cnt, int wish_cnt) {
        this.board_serial = bjd.getBoardSerial();
        this.board_type = bjd.getBoardType();
        this.user_serial = bjd.getUserSerial();
        this.title = bjd.getTitle();
        this.nickname = bjd.getNickname();
        this.user_name = bjd.getUserName();
        this.save_file = bjd.getSaveFile();
        this.board_date = bjd.getBoardDate();
        this.hit = bjd.getHit();
        this.img = img;
        this.comment_cnt = comment_cnt;
        this.wish_cnt = wish_cnt;
    }
}
