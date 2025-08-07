package com.example.zipplz_be.Board.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.util.IOUtils;
import com.example.zipplz_be.Board.dto.*;
import com.example.zipplz_be.Board.repository.BoardRepository;
import com.example.zipplz_be.Board.repository.CommentRepository;
import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.File.repository.FileRepository;
import com.example.zipplz_be.Global.repository.LocalRepository;
import com.example.zipplz_be.Mypage.repository.WishRepository;
import com.example.zipplz_be.Portfolio.dto.PortfolioFileDTO;
import com.example.zipplz_be.Portfolio.dto.PortfolioJoinDTO;
import com.example.zipplz_be.Portfolio.dto.PortfolioViewDTO;
import com.example.zipplz_be.Portfolio.repository.PortfolioRepository;
import com.example.zipplz_be.Schedule.exception.S3Exception;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class BoardServiceImpl implements BoardService {
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucketName}")
    private String bucketName;

    private final BoardRepository boardRepository;
    private final CommentRepository commentRepository;
    private final WishRepository wishRepository;
    private final FileRepository fileRepository;
    private final PortfolioRepository portfolioRepository;
    private final LocalRepository localRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public BoardServiceImpl(AmazonS3 amazonS3, BoardRepository boardRepository, CommentRepository commentRepository, WishRepository wishRepository, FileRepository fileRepository, PortfolioRepository portfolioRepository, LocalRepository localRepository, EntityManager entityManager) {
        this.amazonS3 = amazonS3;
        this.boardRepository = boardRepository;
        this.commentRepository = commentRepository;
        this.wishRepository = wishRepository;
        this.fileRepository = fileRepository;
        this.portfolioRepository = portfolioRepository;
        this.localRepository = localRepository;
        this.entityManager = entityManager;
    }

    @Override
    public int getBoardUser(int boardType, int boardSerial) {
        return boardRepository.getBoardUser(boardType, boardSerial);
    }

    @Override
    public int getLastInsertId() {
        return boardRepository.getLastInsertId();
    }

    @Override
    public int addBoard(int userSerial, int boardType, String title, String boardContent, LocalDateTime boardDate, int hit) {
        return boardRepository.addBoard(userSerial, boardType, title, boardContent, boardDate, hit);
    }

    @Override
    public int modifyBoard(int boardSerial, String title, String boardContent, LocalDateTime boardDate) {
        return boardRepository.modifyBoard(boardSerial, title, boardContent, boardDate);
    }

    @Override
    public int moifyBoardAddress(int boardSerial, String userAddress, String fieldId) {
        return boardRepository.moifyBoardAddress(boardSerial, userAddress, fieldId);
    }

    @Override
    public int deleteBoard(int boardSerial) {
        boardRepository.deleteComment(boardSerial);
        boardRepository.deleteBoardToPortfolio(boardSerial);
        boardRepository.deleteBoardFileRelation(boardSerial);
        return boardRepository.deleteBoard(boardSerial);
    }

    @Override
    public void updateboardhit(int boardSerial) {
        boardRepository.updateboardhit(boardSerial);
    }

    @Override
    public int addBoardUserAddress(int boardSerial, String userAddress, String fieldId) {
        return boardRepository.addBoardUserAddress(boardSerial, userAddress, fieldId);
    }

    @Override
    public List<QuestionListDTO> getQuestions(int boardType) {
        List<QuestionListDTO> views = new ArrayList<>();
        List<BoardJoinDTO> boards = boardRepository.getBoards(boardType);
        for (BoardJoinDTO board : boards) {
            int comment_cnt = commentRepository.getComment(board.getBoardSerial(), -1).size();
            int wish_cnt = wishRepository.getWishCnt(board.getBoardSerial());
            QuestionListDTO view = new QuestionListDTO(board, comment_cnt, wish_cnt);
            views.add(view);
        }
        return views;
    }

    @Override
    public QuestionDetailDTO getQuestion(int boardSerial) {
        BoardJoinDTO board = boardRepository.getBoard(boardSerial);
        List<BoardFileDTO> files = fileRepository.getBoardImg(boardSerial);
        List<CommentJoinDTO> parent_comments = commentRepository.getComment(boardSerial, -1);
        List<CommentViewDTO> comments = new ArrayList<>();
        for (CommentJoinDTO parent_comment : parent_comments) {
            List<CommentJoinDTO> child_comments = new ArrayList<>();
            if (parent_comment.getCommentSerial() != -1) {
                child_comments = commentRepository.getComment(boardSerial, parent_comment.getCommentSerial());
            }
            CommentViewDTO comment = new CommentViewDTO(parent_comment, child_comments);
            comments.add(comment);
        }
        QuestionDetailDTO question = new QuestionDetailDTO(board, files, comments);
        return question;
    }

    @Override
    public List<QuestionListDTO> findQuestionsByContent(int boardType, String searchContent) {
        List<QuestionListDTO> views = new ArrayList<>();
        List<BoardJoinDTO> boards = boardRepository.findBoardsByContent(boardType, searchContent);
        for (BoardJoinDTO board : boards) {
            int comment_cnt = commentRepository.getComment(board.getBoardSerial(), -1).size();
            int wish_cnt = wishRepository.getWishCnt(board.getBoardSerial());
            QuestionListDTO view = new QuestionListDTO(board, comment_cnt, wish_cnt);
            views.add(view);
        }
        return views;
    }

    @Override
    public List<ShowBoardListDTO> getShowBoards(int boardType) {
        List<ShowBoardListDTO> views = new ArrayList<>();
        List<BoardJoinDTO> boards = boardRepository.getBoards(boardType);
        for (BoardJoinDTO board : boards) {
            List<BoardFileDTO> files = fileRepository.getBoardImg(board.getBoardSerial());
            String img = null;
            if (!files.isEmpty()) {
                img = files.getFirst().getSaveFile();
            }
            int comment_cnt = commentRepository.getComment(board.getBoardSerial(), -1).size();
            int wish_cnt = wishRepository.getWishCnt(board.getBoardSerial());
            ShowBoardListDTO view = new ShowBoardListDTO(board, img, comment_cnt, wish_cnt);
            views.add(view);
        }
        return views;
    }

    @Override
    public ShowBoardDetailDTO getShowBoard(int boardSerial) {
        BoardJoinDTO board = boardRepository.getBoard(boardSerial);
        List<BoardFileDTO> files = fileRepository.getBoardImg(boardSerial);
        List<PortfolioViewDTO> tags = new ArrayList<>();
        List<PortfolioJoinDTO> portfolios = portfolioRepository.getPortfolioTags(boardSerial);
        for (PortfolioJoinDTO portfolio : portfolios) {
            List<String> locations = localRepository.getLocalNames(portfolio.getWorker());
            List<PortfolioFileDTO> portfolio_files = fileRepository.getImg(portfolio.getPortfolio_serial());
            String img = null;
            if (!portfolio_files.isEmpty()) {
                img = files.getFirst().getSaveFile();
            }
            PortfolioViewDTO portfolioView = new PortfolioViewDTO(portfolio, locations, img);
            tags.add(portfolioView);
        }

        List<CommentJoinDTO> parent_comments = commentRepository.getComment(boardSerial, -1);
        List<CommentViewDTO> comments = new ArrayList<>();
        for (CommentJoinDTO parent_comment : parent_comments) {
            List<CommentJoinDTO> child_comments = new ArrayList<>();
            if (parent_comment.getCommentSerial() != -1) {
                child_comments = commentRepository.getComment(boardSerial, parent_comment.getCommentSerial());
            }
            CommentViewDTO comment = new CommentViewDTO(parent_comment, child_comments);
            comments.add(comment);
        }
        ShowBoardDetailDTO showboard = new ShowBoardDetailDTO(board, files, tags, comments);
        return showboard;
    }

    @Override
    public List<ShowBoardListDTO> findShowBoardByContent(int boardType, String searchContent) {
        List<ShowBoardListDTO> views = new ArrayList<>();
        List<BoardJoinDTO> boards = boardRepository.findBoardsByContent(boardType, searchContent);
        for (BoardJoinDTO board : boards) {
            List<BoardFileDTO> files = fileRepository.getBoardImg(board.getBoardSerial());
            String img = null;
            if (!files.isEmpty()) {
                img = files.getFirst().getSaveFile();
            }
            int comment_cnt = commentRepository.getComment(board.getBoardSerial(), -1).size();
            int wish_cnt = wishRepository.getWishCnt(board.getBoardSerial());
            ShowBoardListDTO view = new ShowBoardListDTO(board, img, comment_cnt, wish_cnt);
            views.add(view);
        }
        return views;
    }

    @Override
    public List<FindWorkerListDTO> getFindWorkers(int boardType) {
        List<FindWorkerListDTO> views = new ArrayList<>();
        List<BoardJoinDTO> boards = boardRepository.getBoards(boardType);
        for (BoardJoinDTO board : boards) {
            int comment_cnt = commentRepository.getComment(board.getBoardSerial(), -1).size();
            int wish_cnt = wishRepository.getWishCnt(board.getBoardSerial());
            FindWorkerListDTO view = new FindWorkerListDTO(board, comment_cnt, wish_cnt);
            views.add(view);
        }
        return views;
    }

    @Override
    public FindWorkerDetailDTO getFindWorker(int boardSerial) {
        BoardJoinDTO board = boardRepository.getBoard(boardSerial);
        String user_address = boardRepository.getUserAddress(boardSerial);
        String field_id = boardRepository.getFieldId(boardSerial);
        List<BoardFileDTO> files = fileRepository.getBoardImg(boardSerial);
        List<CommentJoinDTO> parent_comments = commentRepository.getComment(boardSerial, -1);
        List<CommentViewDTO> comments = new ArrayList<>();
        for (CommentJoinDTO parent_comment : parent_comments) {
            List<CommentJoinDTO> child_comments = new ArrayList<>();
            if (parent_comment.getCommentSerial() != -1) {
                child_comments = commentRepository.getComment(boardSerial, parent_comment.getCommentSerial());
            }
            CommentViewDTO comment = new CommentViewDTO(parent_comment, child_comments);
            comments.add(comment);
        }
        FindWorkerDetailDTO findworker = new FindWorkerDetailDTO(board, user_address, field_id, files, comments);
        return findworker;
    }

    @Override
    public List<FindWorkerListDTO> findFindWorkerByContent(int boardType, String searchContent) {
        List<FindWorkerListDTO> views = new ArrayList<>();
        List<BoardJoinDTO> boards = boardRepository.findBoardsByContent(boardType, searchContent);
        for (BoardJoinDTO board : boards) {
            int comment_cnt = commentRepository.getComment(board.getBoardSerial(), -1).size();
            int wish_cnt = wishRepository.getWishCnt(board.getBoardSerial());
            FindWorkerListDTO view = new FindWorkerListDTO(board, comment_cnt, wish_cnt);
            views.add(view);
        }
        return views;
    }

    @Override
    @Transactional
    public int addBoardToPortfolio(int board_serial, List<PortfolioViewDTO> views) {
        String query = "INSERT INTO BoardToPortfolio(board_serial, portfolio_serial) VALUES ";

        StringBuilder sb = new StringBuilder();
        for (PortfolioViewDTO view : views) {
            if (!sb.isEmpty()) {
                sb.append(", ");
            }
            sb.append(String.format("(%d, %d)", board_serial, view.getPortfolio_serial()));
        }

        query += sb.toString();
        return entityManager.createNativeQuery(query).executeUpdate();
    }

    @Override
    @Transactional
    public int uploadImageService(List<MultipartFile> images, int boardSerial) {
        if(images.isEmpty()) {
            throw new S3Exception("파일이 비었습니다.");
        }
        List<Integer> file_serials = new ArrayList<>();
        for (MultipartFile image : images) {
            if(image.isEmpty() || Objects.isNull(image.getOriginalFilename())) {
                throw new S3Exception("파일이 비었습니다.");
            }

            String url = this.uploadImage(image);
            File file = fileRepository.findBySaveFile(url);
            file_serials.add(file.getFileSerial());
        }

        String query = "INSERT INTO BoardFileRelation(board_serial, file_serial) VALUES ";

        StringBuilder sb = new StringBuilder();
        for (int file_serial : file_serials) {
            if (!sb.isEmpty()) {
                sb.append(", ");
            }
            sb.append(String.format("(%d, %d)", boardSerial, file_serial));
        }

        query += sb.toString();
        return entityManager.createNativeQuery(query).executeUpdate();
    }

    private String uploadImage(MultipartFile image) {
        this.validateImageFileExtension(image.getOriginalFilename());

        try {
            return this.uploadToS3(image);
        }catch(IOException e) {
            throw new S3Exception("이미지 업로드 중 에러 발생했습니다.");
        }

    }

    private String uploadToS3(MultipartFile image) throws IOException {
        String originalFilename = image.getOriginalFilename();

        String extention = originalFilename.substring(originalFilename.lastIndexOf("."));

        //파일명
        String s3FileName = UUID.randomUUID().toString().substring(0, 10) + originalFilename;

        InputStream is = image.getInputStream();
        byte[] bytes = IOUtils.toByteArray(is);

        ObjectMetadata metadata = new ObjectMetadata(); //metadata 생성
        metadata.setContentType("image/" + extention);
        metadata.setContentLength(bytes.length);

        //S3에 요청할 때 사용할 byteInputStream 생성
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
        String url = "";

        try {
            //S3로 putObject 할 때 사용할 요청 객체
            //생성자 : bucket 이름, 파일 명, byteInputStream, metadata
            PutObjectRequest putObjectRequest =
                    new PutObjectRequest(bucketName, s3FileName, byteArrayInputStream, metadata)
                            .withCannedAcl(CannedAccessControlList.PublicRead);

            //실제로 S3에 이미지 데이터를 넣는 부분
            amazonS3.putObject(putObjectRequest);

            url = amazonS3.getUrl(bucketName, s3FileName).toString();

            //file 객체 하나 만들어서 repository로 db에 추가
            File file = new File();
            file.setSaveFile(url);
            file.setFileName(s3FileName);
            file.setOriginalFile(image.getOriginalFilename());

            fileRepository.save(file);
        } catch (Exception e){
            throw new S3Exception("Put Object 도중에 에러 발생");
        }finally {
            byteArrayInputStream.close();
            is.close();
        }

        return url;
    }

    private void validateImageFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            throw new S3Exception("파일 형식이 존재하지 않습니다.");
        }

        String extention = filename.substring(lastDotIndex + 1).toLowerCase();
        List<String> allowedExtentionList = Arrays.asList("jpg", "jpeg", "png", "gif");

        if (!allowedExtentionList.contains(extention)) {
            throw new S3Exception("유효하지 않은 파일 형식입니다.");
        }

    }
}