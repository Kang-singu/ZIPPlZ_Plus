package com.example.zipplz_be.Mypage.service;

import com.example.zipplz_be.Board.dto.FindWorkerListDTO;
import com.example.zipplz_be.Board.dto.QuestionListDTO;
import com.example.zipplz_be.Board.dto.ShowBoardListDTO;
import com.example.zipplz_be.Board.service.BoardService;
import com.example.zipplz_be.Board.service.WorkerListService;
import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.File.repository.FileRepository;
import com.example.zipplz_be.Global.entity.Local;
import com.example.zipplz_be.Global.exception.LocalNotFoundException;
import com.example.zipplz_be.Global.repository.LocalRepository;
import com.example.zipplz_be.S3.service.S3Service;
import com.example.zipplz_be.Mypage.dto.LocalResponseDTO;
import com.example.zipplz_be.Mypage.dto.MyPageResponseDTO;
import com.example.zipplz_be.Mypage.dto.UpdateCustomerDTO;
import com.example.zipplz_be.Mypage.dto.UpdateWorkerDTO;
import com.example.zipplz_be.Mypage.entity.Wish;
import com.example.zipplz_be.Mypage.repository.WishRepository;
import com.example.zipplz_be.Portfolio.dto.PortfolioViewDTO;
import com.example.zipplz_be.Schedule.exception.S3Exception;
import com.example.zipplz_be.User.dto.WorkerLocationDTO;
import com.example.zipplz_be.User.entity.Customer;
import com.example.zipplz_be.User.entity.User;
import com.example.zipplz_be.User.exception.UserNotFoundException;
import com.example.zipplz_be.User.repository.CustomerRepository;
import com.example.zipplz_be.User.repository.UserRepository;
import com.example.zipplz_be.User.repository.WorkerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final WorkerRepository workerRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final LocalRepository localRepository;
    private final FileRepository fileRepository;
    private final S3Service s3Service;
    private final WishRepository wishRepository;
    private final WorkerListService workerListService;
    private final BoardService boardService;

    @Override
    public MyPageResponseDTO getMyPage(int userSerial, String role) {
        if (!userRepository.existsByUserSerial(userSerial)) {
            throw new UserNotFoundException("해당 유저가 존재하지 않습니다.");
        }
        User user = userRepository.findByUserSerial(userSerial);
        return MyPageResponseDTO.builder()
                .profileImg(user.getFileSerial())
                .name(user.getUserName())
                .role(role).build();
    }

    @Override
    public boolean updateCustomer(UpdateCustomerDTO updateCustomerDTO) {
        if (!userRepository.existsByUserSerial(updateCustomerDTO.getUserSerial())) {
            throw new UserNotFoundException("해당 유저가 존재하지 않습니다.");
        }
        User orgUser = userRepository.findByUserSerial(updateCustomerDTO.getUserSerial());
        orgUser.setTel(updateCustomerDTO.getTel());
        User currUser = userRepository.save(orgUser);

        if (!customerRepository.existsByUserSerial(currUser)) {
            throw new UserNotFoundException("해당 고객이 존재하지 않습니다.");
        }
        Customer orgCustomer = customerRepository.findByUserSerial(currUser);
        orgCustomer.setNickname(updateCustomerDTO.getNickname());
        orgCustomer.setCurrentAddress(updateCustomerDTO.getCurrentAddress());
        Customer currCustomer = customerRepository.save(orgCustomer);

        return true;
    }

    @Override
    @Transactional
    public boolean updateWorker(UpdateWorkerDTO updateWorkerDTO) {
        if (!userRepository.existsByUserSerial(updateWorkerDTO.getUserSerial())) {
            throw new UserNotFoundException("해당 유저가 존재하지 않습니다.");
        }
        User orgUser = userRepository.findByUserSerial(updateWorkerDTO.getUserSerial());
        orgUser.setTel(updateWorkerDTO.getTel());
        User currUser = userRepository.save(orgUser);

        if (!workerRepository.existsByUserSerial(currUser)) {
            throw new UserNotFoundException("해당 시공자가 존재하지 않습니다.");
        }

        localRepository.deleteByUserSerial(currUser); // 기존 활동지역 삭제
        List<WorkerLocationDTO> locationList = updateWorkerDTO.getLocationList();
        if (locationList != null) {
            List<Local> localList = locationList.stream()
                    .map(
                            location -> Local.builder()
                                    .userSerial(currUser)
                                    .sidoCode(location.getSidoCode())
                                    .gugunCode(location.getGugunCode())
                                    .localName(location.getLocalName()).build())
                    .collect(Collectors.toList());
            localRepository.saveAll(localList);
        }
        return true;
    }

    @Override
    public boolean changePassword(int userSerial, String newPassword) {
        if (!userRepository.existsByUserSerial(userSerial)) {
            throw new UserNotFoundException("해당 유저가 존재하지 않습니다.");
        }

        User user = userRepository.findByUserSerial(userSerial);
        user.setPassword(bCryptPasswordEncoder.encode(newPassword));
        User changedUser = userRepository.save(user);

        return true;
    }

    @Override
    public void setProfileImg(int userSerial, MultipartFile image) throws IOException {
        if (image.isEmpty() || Objects.isNull(image.getOriginalFilename())) {
            throw new S3Exception("파일이 비었습니다.");
        }
        if (!userRepository.existsByUserSerial(userSerial)) {
            throw new UserNotFoundException("해당 유저가 존재하지 않습니다.");
        }
        User user = userRepository.findByUserSerial(userSerial);

        File file = user.getFileSerial();
        if (user.getFileSerial() != null) {
            // S3에서 삭제
            s3Service.deleteS3(file.getFileName());
            // user테이블에서 file 삭제
            user.setFileSerial(null);
            userRepository.save(user);
            // file 테이블에서 삭제
            fileRepository.delete(file);
        }

        // S3에 저장 & file table에 저장
        String url = s3Service.uploadImage(image);

        File newFile = fileRepository.findBySaveFile(url);

        // user에 file 1대1 매핑
        user.setFileSerial(newFile);
        userRepository.save(user);
    }

    @Override
    public void deleteProfileImg(int userSerial) throws IOException {
        if (!userRepository.existsByUserSerial(userSerial)) {
            throw new UserNotFoundException("해당 유저가 존재하지 않습니다.");
        }
        User user = userRepository.findByUserSerial(userSerial);

        File file = user.getFileSerial();
        if (file != null) {
            // S3에서 삭제
            s3Service.deleteS3(file.getFileName());
            // user테이블에서 file 삭제
            user.setFileSerial(null);
            userRepository.save(user);
            // file 테이블에서 삭제
            fileRepository.delete(file);
        }
    }

    @Override
    public List<LocalResponseDTO> getWorkerLocations(int userSerial) {
        if (!userRepository.existsByUserSerial(userSerial)) {
            throw new UserNotFoundException("해당 유저가 존재하지 않습니다.");
        }
        User user = userRepository.findByUserSerial(userSerial);

        if (!localRepository.existsByUserSerial(user)) {
            throw new LocalNotFoundException("시공자의 활동지역이 존재하지 않습니다");
        }

        return localRepository.findAllByUserSerial(user).stream()
                .map(local -> LocalResponseDTO.builder()
                        .sidoCode(local.getSidoCode())
                        .gugunCode(local.getGugunCode())
                        .localName(local.getLocalName()).build())
                .collect(Collectors.toList());
    }

    @Override
    public List<QuestionListDTO> getMyQuestions(int userSerial) {
        if (!userRepository.existsByUserSerial(userSerial)) {
            throw new UserNotFoundException("해당 유저가 존재하지 않습니다.");
        }
        User user = userRepository.findByUserSerial(userSerial);

        List<QuestionListDTO> questionList = boardService.getQuestions(1);
        return questionList.stream()
                .filter(question -> question.getUser_serial() == user.getUserSerial())
                .collect(Collectors.toList());
    }

    @Override
    public List<ShowBoardListDTO> getMyShowBoards(int userSerial) {
        if (!userRepository.existsByUserSerial(userSerial)) {
            throw new UserNotFoundException("해당 유저가 존재하지 않습니다.");
        }
        User user = userRepository.findByUserSerial(userSerial);

        List<ShowBoardListDTO> showBoardList = boardService.getShowBoards(2);
        return showBoardList.stream()
                .filter(showBoard -> showBoard.getUser_serial() == user.getUserSerial())
                .collect(Collectors.toList());
    }

    @Override
    public List<FindWorkerListDTO> getMyFindWorkers(int userSerial) {
        if (!userRepository.existsByUserSerial(userSerial)) {
            throw new UserNotFoundException("해당 유저가 존재하지 않습니다.");
        }
        User user = userRepository.findByUserSerial(userSerial);

        List<FindWorkerListDTO> findWorkerList = boardService.getFindWorkers(3);
        return findWorkerList.stream()
                .filter(findWorker -> findWorker.getUser_serial() == user.getUserSerial())
                .collect(Collectors.toList());
    }

    // 찜
    @Override
    public List<PortfolioViewDTO> getWishedWorkers(int userSerial) {
        if (!userRepository.existsByUserSerial(userSerial)) {
            throw new UserNotFoundException("해당 유저가 존재하지 않습니다.");
        }
        User user = userRepository.findByUserSerial(userSerial);

        List<Wish> wishList = wishRepository.findAllByUserSerialAndWishType(user, 5); // 포트폴리오는 wishType == 5
        List<Integer> portfolioWishList = wishList.stream()
                .map(Wish::getWishSerial)
                .collect(Collectors.toList());

        List<PortfolioViewDTO> portfolioList = workerListService.getWorkLists();
        return portfolioList.stream()
                .filter(portfolio -> portfolioWishList.contains(portfolio.getPortfolio_serial()))
                .collect(Collectors.toList());
    }

    @Override
    public List<QuestionListDTO> getWishedQuestions(int userSerial) {
        if (!userRepository.existsByUserSerial(userSerial)) {
            throw new UserNotFoundException("해당 유저가 존재하지 않습니다.");
        }
        User user = userRepository.findByUserSerial(userSerial);

        List<Wish> wishList = wishRepository.findAllByUserSerialAndWishType(user, 1);
        List<Integer> questionWishList = wishList.stream()
                .map(Wish::getWishSerial)
                .collect(Collectors.toList());

        List<QuestionListDTO> questionList = boardService.getQuestions(1);
        return questionList.stream()
                .filter(question -> questionWishList.contains(question.getBoard_serial()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ShowBoardListDTO> getWishedShowBoards(int userSerial) {
        if (!userRepository.existsByUserSerial(userSerial)) {
            throw new UserNotFoundException("해당 유저가 존재하지 않습니다.");
        }
        User user = userRepository.findByUserSerial(userSerial);

        List<Wish> wishList = wishRepository.findAllByUserSerialAndWishType(user, 2);
        List<Integer> showBoardWishList = wishList.stream()
                .map(Wish::getWishSerial)
                .collect(Collectors.toList());

        List<ShowBoardListDTO> showBoardList = boardService.getShowBoards(2);
        return showBoardList.stream()
                .filter(showBoard -> showBoardWishList.contains(showBoard.getBoard_serial()))
                .collect(Collectors.toList());
    }

    @Override
    public List<FindWorkerListDTO> getWishedFindWorkers(int userSerial) {
        if (!userRepository.existsByUserSerial(userSerial)) {
            throw new UserNotFoundException("해당 유저가 존재하지 않습니다.");
        }
        User user = userRepository.findByUserSerial(userSerial);

        List<Wish> wishList = wishRepository.findAllByUserSerialAndWishType(user, 3);
        List<Integer> findWorkerWishList = wishList.stream()
                .map(Wish::getWishSerial)
                .collect(Collectors.toList());

        List<FindWorkerListDTO> findWorkerList = boardService.getFindWorkers(3);
        return findWorkerList.stream()
                .filter(findWorker -> findWorkerWishList.contains(findWorker.getBoard_serial()))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAccount(int userSerial) {
        if (!userRepository.existsByUserSerial(userSerial)) {
            throw new UserNotFoundException("해당 유저가 존재하지 않습니다.");
        }
        User user = userRepository.findByUserSerial(userSerial);

        user.setDelYN(1);
        userRepository.save(user);
    }
}
