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
public class QuestionListDTO {
    int board_serial;
    int board_type;
    int user_serial;
    String title;
    String board_content;
    LocalDateTime board_date;
    int hit;
    String nickname;
    String user_name;
    String save_file;
    int comment_cnt;
    int wish_cnt;

    public QuestionListDTO(BoardJoinDTO bjd, int comment_cnt, int wish_cnt) {
        this.board_serial = bjd.getBoardSerial();
        this.board_type = bjd.getBoardType();
        this.user_serial = bjd.getUserSerial();
        this.title = bjd.getTitle();
        this.board_content = bjd.getBoardContent();
        this.board_date = bjd.getBoardDate();
        this.hit = bjd.getHit();
        this.nickname = bjd.getNickname();
        this.user_name = bjd.getUserName();
        this.save_file = bjd.getSaveFile();
        this.comment_cnt = comment_cnt;
        this.wish_cnt = wish_cnt;
    }
}
