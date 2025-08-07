package com.example.zipplz_be.Board.dto;

import java.util.List;

public class FindWorkerDetailDTO {
    BoardJoinDTO board;
    String user_address;
    String field_id;
    List<BoardFileDTO> board_images;
    List<CommentViewDTO> comments;

    public FindWorkerDetailDTO(BoardJoinDTO board, String user_address, String field_id, List<BoardFileDTO> board_images, List<CommentViewDTO> comments) {
        this.board = board;
        this.user_address = user_address;
        this.field_id = field_id;
        this.board_images = board_images;
        this.comments = comments;
    }

    public BoardJoinDTO getBoard() {
        return board;
    }

    public void setBoard(BoardJoinDTO board) {
        this.board = board;
    }

    public String getUser_address() {
        return user_address;
    }

    public void setUser_address(String user_address) {
        this.user_address = user_address;
    }

    public String getField_id() {
        return field_id;
    }

    public void setField_id(String field_id) {
        this.field_id = field_id;
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
        return "FindWorkerDetailDTO{" +
                "board=" + board +
                ", user_address='" + user_address + '\'' +
                ", field_id=" + field_id +
                ", board_images=" + board_images +
                ", comments=" + comments +
                '}';
    }
}
