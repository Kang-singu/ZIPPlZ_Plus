package com.example.zipplz_be.Board.dto;

import java.util.List;

public class QuestionDetailDTO {
    BoardJoinDTO board;
    List<BoardFileDTO> board_images;
    List<CommentViewDTO> comments;

    public QuestionDetailDTO(BoardJoinDTO board, List<BoardFileDTO> board_images, List<CommentViewDTO> comments) {
        this.board = board;
        this.board_images = board_images;
        this.comments = comments;
    }

    public BoardJoinDTO getBoard() {
        return board;
    }

    public void setBoard(BoardJoinDTO board) {
        this.board = board;
    }

    public List<BoardFileDTO> getBoard_images() {
        return board_images;
    }

    public void setBoard_images(List<BoardFileDTO> board_images) {
        this.board_images = board_images;
    }

    public List<CommentViewDTO> getComments() {
        return comments;
    }

    public void setComments(List<CommentViewDTO> comments) {
        this.comments = comments;
    }

    @Override
    public String toString() {
        return "QuestionDetailDTO{" +
                "board=" + board +
                ", board_images=" + board_images +
                ", comments=" + comments +
                '}';
    }
}
