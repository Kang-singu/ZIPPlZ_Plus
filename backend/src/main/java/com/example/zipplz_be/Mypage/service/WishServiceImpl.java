package com.example.zipplz_be.Mypage.service;

import com.example.zipplz_be.File.repository.FileRepository;
import com.example.zipplz_be.Global.repository.LocalRepository;
import com.example.zipplz_be.Mypage.repository.WishRepository;
import com.example.zipplz_be.Portfolio.dto.PortfolioFileDTO;
import com.example.zipplz_be.Portfolio.dto.PortfolioJoinDTO;
import com.example.zipplz_be.Portfolio.dto.PortfolioViewDTO;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WishServiceImpl implements WishService {

    private final WishRepository wishRepository;
    private final LocalRepository localRepository;
    private final FileRepository fileRepository;

    public WishServiceImpl(WishRepository wishRepository, LocalRepository localRepository, FileRepository fileRepository) {
        this.wishRepository = wishRepository;
        this.localRepository = localRepository;
        this.fileRepository = fileRepository;
    }

    @Override
    public int addWish(int userSerial, int wishType, int wishSerial) throws DataIntegrityViolationException {
        try {
            return wishRepository.addWish(userSerial, wishType, wishSerial);
        } catch (DataIntegrityViolationException e) {
            throw new DataIntegrityViolationException("중복 발생", e);
        }
    }

    @Override
    public int deleteWish(int wishSerial) {
        return wishRepository.deleteWish(wishSerial);
    }

    @Override
    public int searchWish(int userSerial, int wishSerial) {
        return wishRepository.searchWish(userSerial, wishSerial);
    }

    @Override
    public List<PortfolioViewDTO> getWorkerWishList(int wishType, int userSerial) {
        List<PortfolioViewDTO> portfolioViews = new ArrayList<>();
        List<PortfolioJoinDTO> portfolios = wishRepository.getWorkerWishList(wishType, userSerial);
        for (PortfolioJoinDTO portfolio : portfolios) {
            List<String> locations = localRepository.getLocalNames(portfolio.getWorker());
            List<PortfolioFileDTO> files = fileRepository.getImg(portfolio.getPortfolio_serial());
            String img = null;
            if (!files.isEmpty()) {
                img = files.getFirst().getSaveFile();
            }
            PortfolioViewDTO portfolioView = new PortfolioViewDTO(portfolio, locations, img);
            portfolioViews.add(portfolioView);
        }
        return portfolioViews;
    }

//    @Override
//    public List<MaterialViewDTO> getMaterialWishList(int wishType, int userSerial) {
//        List<MaterialViewDTO> materialViews = new ArrayList<>();
//        List<MaterialDTO> materials = wishRepository.getMaterialWishList(wishType, userSerial);
//        for (MaterialDTO material : materials) {
//            List<MaterialFileDTO> files = fileRepository.getMaterialImg(material.getMaterialSerial());
//            String img = null;
//            if (!files.isEmpty()) {
//                img = files.getFirst().getSaveFile();
//            }
//            MaterialViewDTO materialView = new MaterialViewDTO(material, img);
//            materialViews.add(materialView);
//        }
//        return materialViews;
//    }
}
