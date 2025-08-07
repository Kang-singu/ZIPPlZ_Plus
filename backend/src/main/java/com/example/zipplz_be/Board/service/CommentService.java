package com.example.zipplz_be.Board.service;

import java.time.LocalDateTime;

public interface CommentService {
    int addComment(int userSerial, int boardSerial, String commentContent, LocalDateTime commentDate, int parentCommentSerial, int orderNumber, int isDeleted);
    int deleteComment(int commentSerial);
}
