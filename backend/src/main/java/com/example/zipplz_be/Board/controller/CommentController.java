package com.example.zipplz_be.Board.controller;


import com.example.zipplz_be.Board.service.CommentService;
import com.example.zipplz_be.Global.dto.ResponseDTO;
import com.example.zipplz_be.User.dto.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/comment")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/add")
    public ResponseEntity<ResponseDTO> addComment(Authentication authentication, @RequestBody(required = false) Map<String, Object> params) {
        ResponseDTO responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
            int user_serial = customUserDetails.getUserSerial();
            int board_serial = (int) params.get("board_serial");
            String comment_content = (String) params.get("comment_content");
            LocalDateTime comment_date = LocalDateTime.now();
            int parent_comment_serial = (int) params.get("parent_comment_serial");
            int order_number = (int) params.get("order_number");
            int is_deleted = 0;

            int result = commentService.addComment(user_serial, board_serial, comment_content, comment_date, parent_comment_serial, order_number, is_deleted);
            if (result == 1 ) {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "댓글 저장 완료", true);
            } else {
                status = HttpStatus.BAD_REQUEST;
                responseDTO = new ResponseDTO<>(status.value(), "댓글 저장 실패");
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }

    @DeleteMapping("/delete/{comment_serial}")
    public ResponseEntity<ResponseDTO> deleteComment(Authentication authentication, @PathVariable("comment_serial") int comment_serial) {
        ResponseDTO responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            int result = commentService.deleteComment(comment_serial);
            if (result == 1 ) {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "댓글 삭제 완료", true);
            } else {
                status = HttpStatus.BAD_REQUEST;
                responseDTO = new ResponseDTO<>(status.value(), "댓글 삭제 실패");
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }
}
