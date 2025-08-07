package com.example.zipplz_be.Board.service;

import com.example.zipplz_be.Board.dto.*;
import com.example.zipplz_be.Portfolio.dto.PortfolioViewDTO;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

public interface BoardService {
    int getBoardUser(int boardType, int boardSerial);
    int getLastInsertId();
    int addBoard(int userSerial, int boardType, String title, String boardContent, LocalDateTime boardDate, int hit);
    int modifyBoard(int boardSerial, String title, String boardContent, LocalDateTime boardDate);

    List<QuestionListDTO> getQuestions(int boardType);
    QuestionDetailDTO getQuestion(int boardSerial);
    List<QuestionListDTO> findQuestionsByContent(int boardType, String searchContent);

    List<ShowBoardListDTO> getShowBoards(int boardType);
    ShowBoardDetailDTO getShowBoard(int boardSerial);
    List<ShowBoardListDTO> findShowBoardByContent(int boardType, String searchContent);

    List<FindWorkerListDTO> getFindWorkers(int boardType);
    FindWorkerDetailDTO getFindWorker(int boardSerial);
    List<FindWorkerListDTO> findFindWorkerByContent(int boardType, String searchContent);

    int addBoardToPortfolio(int board_serial, List<PortfolioViewDTO> views);
    int uploadImageService(List<MultipartFile> images, int boardSerial);

    int deleteBoard(int boardSerial);

    void updateboardhit(int boardSerial);

    int addBoardUserAddress(int boardSerial, String userAddress, String fieldId);

    int moifyBoardAddress(int boardSerial, String userAddress, String fieldId);
}
