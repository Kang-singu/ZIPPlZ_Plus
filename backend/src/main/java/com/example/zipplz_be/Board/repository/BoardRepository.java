package com.example.zipplz_be.Board.repository;

import com.example.zipplz_be.Board.dto.BoardJoinDTO;
import com.example.zipplz_be.Board.entity.Board;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Integer> {
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO Board(user_serial, board_type, title, board_content, board_date, hit) " +
            "VALUES(:userSerial, :boardType, :title, :boardContent, :boardDate, :hit)", nativeQuery = true)
    int addBoard(@Param("userSerial") int userSerial,
                 @Param("boardType") int boardType,
                 @Param("title") String title,
                 @Param("boardContent") String boardContent,
                 @Param("boardDate") LocalDateTime boardDate,
                 @Param("hit") int hit);

    @Modifying
    @Transactional
    @Query(value = "UPDATE Board " +
            "SET title = :title, board_content = :boardContent, board_date = :boardDate " +
            "WHERE board_serial = :boardSerial", nativeQuery = true)
    int modifyBoard(@Param("boardSerial") int boardSerial,
                    @Param("title") String title,
                    @Param("boardContent") String boardContent,
                    @Param("boardDate") LocalDateTime boardDate);
    @Modifying
    @Transactional
    @Query(value = "UPDATE BoardUserAddress " +
            "SET user_address = :userAddress, field_id = :fieldId " +
            "WHERE board_serial = :boardSerial", nativeQuery = true)
    int moifyBoardAddress(@Param("boardSerial") int boardSerial,
                          @Param("userAddress") String userAddress,
                          @Param("fieldId") String fieldId);


    @Query(value = "SELECT b.*, cus.nickname, u.user_name, f.save_file " +
            "FROM ( SELECT * " +
            "FROM Board " +
            "WHERE board_type = :boardType ) b " +
            "LEFT JOIN Customer cus ON cus.user_serial = b.user_serial " +
            "LEFT JOIN USERS u on u.user_serial = b.user_serial " +
            "LEFT JOIN File f on f.file_serial = u.file_serial", nativeQuery = true)
    List<BoardJoinDTO> getBoards(@Param("boardType") int boardType);

    @Query(value = "SELECT b.*, cus.nickname, u.user_name, f.save_file " +
            "FROM ( SELECT * " +
            "FROM Board " +
            "WHERE board_serial = :boardSerial ) b " +
            "LEFT JOIN Customer cus ON cus.user_serial = b.user_serial " +
            "LEFT JOIN USERS u on u.user_serial = b.user_serial " +
            "LEFT JOIN File f on f.file_serial = u.file_serial", nativeQuery = true)
    BoardJoinDTO getBoard(@Param("boardSerial") int boardSerial);

    @Query(value = "SELECT b.*, cus.nickname, u.user_name, f.save_file " +
            "FROM ( SELECT * " +
            "FROM Board " +
            "WHERE board_type = :boardType and ( title LIKE CONCAT('%', :searchContent, '%')  or board_content LIKE CONCAT('%', :searchContent, '%') ) ) b " +
            "LEFT JOIN Customer cus ON cus.user_serial = b.user_serial " +
            "LEFT JOIN USERS u on u.user_serial = b.user_serial " +
            "LEFT JOIN File f on f.file_serial = u.file_serial", nativeQuery = true)
    List<BoardJoinDTO> findBoardsByContent(@Param("boardType") int boardType, @Param("searchContent") String searchContent);

    @Query(value = "SELECT LAST_INSERT_ID()", nativeQuery = true)
    int getLastInsertId();

    @Query(value = "SELECT user_serial " +
            "FROM Board " +
            "WHERE board_type = :boardType and board_serial = :boardSerial", nativeQuery = true)
    int getBoardUser(@Param("boardType") int boardType, @Param("boardSerial") int boardSerial);


    @Modifying
    @Transactional
    @Query(value = "DELETE FROM Comment " +
            "WHERE board_serial = :boardSerial ", nativeQuery = true)
    void deleteComment(@Param("boardSerial") int boardSerial);@Modifying

    @Transactional
    @Query(value = "DELETE FROM BoardToPortfolio " +
            "WHERE board_serial = :boardSerial ", nativeQuery = true)
    void deleteBoardToPortfolio(@Param("boardSerial") int boardSerial);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM BoardFileRelation " +
            "WHERE board_serial = :boardSerial ", nativeQuery = true)
    void deleteBoardFileRelation(@Param("boardSerial") int boardSerial);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM Board " +
            "WHERE board_serial = :boardSerial ", nativeQuery = true)
    int deleteBoard(@Param("boardSerial") int boardSerial);

    @Modifying
    @Transactional
    @Query(value = "UPDATE Board " +
            "SET hit = hit + 1 " +
            "WHERE board_serial = :boardSerial", nativeQuery = true)
    void updateboardhit(@Param("boardSerial") int boardSerial);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO BoardUserAddress(board_serial, user_address, field_id) " +
            "VALUES(:boardSerial, :userAddress, :fieldId)", nativeQuery = true)
    int addBoardUserAddress(@Param("boardSerial") int boardSerial, @Param("userAddress") String userAddress, @Param("fieldId") String fieldId);

    @Query(value = "SELECT user_address " +
            "FROM BoardUserAddress " +
            "WHERE board_serial = :boardSerial", nativeQuery = true)
    String getUserAddress(@Param("boardSerial") int boardSerial);

    @Query(value = "SELECT field_id " +
            "FROM BoardUserAddress " +
            "WHERE board_serial = :boardSerial", nativeQuery = true)
    String getFieldId(@Param("boardSerial") int boardSerial);

}
