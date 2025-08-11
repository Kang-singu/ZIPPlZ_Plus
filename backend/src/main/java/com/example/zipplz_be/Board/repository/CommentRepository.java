package com.example.zipplz_be.Board.repository;

import com.example.zipplz_be.Board.dto.CommentJoinDTO;
import com.example.zipplz_be.Board.entity.Comment;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO Comment(user_serial, board_serial, comment_content, comment_date, parent_comment_serial, order_number, is_deleted) " +
            "VALUES(:userSerial, :boardSerial, :commentContent, :commentDate, :parentCommentSerial, :orderNumber, :isDeleted)", nativeQuery = true)
    int addComment(@Param("userSerial") int userSerial,
                   @Param("boardSerial") int boardSerial,
                   @Param("commentContent") String commentContent,
                   @Param("commentDate") LocalDateTime commentDate,
                   @Param("parentCommentSerial") int parentCommentSerial,
                   @Param("orderNumber") int orderNumber,
                   @Param("isDeleted") int isDeleted);

    @Query(value = "SELECT c.*, cus.nickname, u.user_name, f.save_file " +
            "FROM ( SELECT * " +
            "FROM Comment " +
            "WHERE board_serial = :boardSerial and parent_comment_serial = :commentSerial ) as c " +
            "LEFT JOIN Customer cus ON cus.user_serial = c.user_serial " +
            "LEFT JOIN USERS u ON u.user_serial = c.user_serial " +
            "LEFT JOIN File f ON f.file_serial = u.file_serial", nativeQuery = true)
    List<CommentJoinDTO> getComment(@Param("boardSerial") int boardSerial, @Param("commentSerial") int commentSerial);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM Comment " +
            "WHERE comment_serial = :commentSerial", nativeQuery = true)
    int deleteComment(@Param("commentSerial") int commentSerial);
}
