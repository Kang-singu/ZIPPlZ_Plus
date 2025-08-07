package com.example.zipplz_be.Board.dto;

import com.example.zipplz_be.Portfolio.dto.PortfolioViewDTO;

import java.util.List;

public class ShowBoardDetailDTO {
    BoardJoinDTO board;
    List<BoardFileDTO> board_images;
    List<PortfolioViewDTO> tags;
    List<CommentViewDTO> comments;

    public ShowBoardDetailDTO(BoardJoinDTO board, List<BoardFileDTO> board_images, List<PortfolioViewDTO> tags, List<CommentViewDTO> comments) {
        this.board = board;
        this.board_images = board_images;
        this.tags = tags;
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

    public List<PortfolioViewDTO> getTags() {
        return tags;
    }

    public void setTags(List<PortfolioViewDTO> tags) {
        this.tags = tags;
    }

    public List<CommentViewDTO> getComments() {
        return comments;
    }

    public void setComments(List<CommentViewDTO> comments) {
        this.comments = comments;
    }

    @Override
    public String toString() {
        return "ShowBoardDetailDTO{" +
                "board=" + board +
                ", board_images=" + board_images +
                ", tags=" + tags +
                ", comments=" + comments +
                '}';
    }
}
