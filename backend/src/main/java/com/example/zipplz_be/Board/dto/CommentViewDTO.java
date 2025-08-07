package com.example.zipplz_be.Board.dto;

import java.util.List;

public class CommentViewDTO {
    private CommentJoinDTO parent_comment;
    private List<CommentJoinDTO> child_comments;

    public CommentViewDTO(CommentJoinDTO parent_comment, List<CommentJoinDTO> child_comments) {
        this.parent_comment = parent_comment;
        this.child_comments = child_comments;
    }

    public CommentJoinDTO getParent_comment() {
        return parent_comment;
    }

    public void setParent_comment(CommentJoinDTO parent_comment) {
        this.parent_comment = parent_comment;
    }

    public List<CommentJoinDTO> getChild_comments() {
        return child_comments;
    }

    public void setChild_comments(List<CommentJoinDTO> child_comments) {
        this.child_comments = child_comments;
    }

    @Override
    public String toString() {
        return "CommentViewDTO{" +
                "parent_comment=" + parent_comment +
                ", child_comments=" + child_comments +
                '}';
    }
}
