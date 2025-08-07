package com.example.zipplz_be.Board.service;

import com.example.zipplz_be.Board.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    public CommentServiceImpl(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Override
    public int addComment(int userSerial, int boardSerial, String commentContent, LocalDateTime commentDate, int parentCommentSerial, int orderNumber, int isDeleted) {
        return commentRepository.addComment(userSerial, boardSerial, commentContent, commentDate, parentCommentSerial, orderNumber, isDeleted);
    }

    @Override
    public int deleteComment(int commentSerial) {
        return commentRepository.deleteComment(commentSerial);
    }
}
