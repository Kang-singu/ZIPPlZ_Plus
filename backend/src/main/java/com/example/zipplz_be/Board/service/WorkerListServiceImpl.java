package com.example.zipplz_be.Board.service;

import com.example.zipplz_be.File.repository.FileRepository;
import com.example.zipplz_be.Global.repository.LocalRepository;
import com.example.zipplz_be.Portfolio.dto.PortfolioFileDTO;
import com.example.zipplz_be.Portfolio.dto.PortfolioJoinDTO;
import com.example.zipplz_be.Portfolio.dto.PortfolioViewDTO;
import com.example.zipplz_be.Portfolio.repository.PortfolioRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WorkerListServiceImpl implements WorkerListService {

    private final PortfolioRepository portfolioRepository;
    private final LocalRepository localRepository;
    private final FileRepository fileRepository;

    public WorkerListServiceImpl(PortfolioRepository portfolioRepository, LocalRepository localRepository, FileRepository fileRepository) {
        this.portfolioRepository = portfolioRepository;
        this.localRepository = localRepository;
        this.fileRepository = fileRepository;
    }

    @Override
    public List<PortfolioViewDTO> getWorkLists() {
        List<PortfolioViewDTO> portfolioViews = new ArrayList<>();
        List<PortfolioJoinDTO> portfolios = portfolioRepository.getPortfolioJoins();
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

    @Override
    public List<PortfolioViewDTO> getWorkListByField(int fieldCode) {
        List<PortfolioViewDTO> portfolioViews = new ArrayList<>();
        List<PortfolioJoinDTO> portfolios = portfolioRepository.getPortfolioJoinsByField(fieldCode);
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

    @Override
    public List<PortfolioViewDTO> getWorkListByName(String name) {
        List<PortfolioViewDTO> portfolioViews = new ArrayList<>();
        List<PortfolioJoinDTO> portfolios = portfolioRepository.getPortfolioJoinsByName(name);
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

    @Override
    public List<PortfolioViewDTO> getWorkListTop() {
        List<PortfolioViewDTO> portfolioViews = new ArrayList<>();
        List<PortfolioJoinDTO> portfolios = portfolioRepository.getPortfolioJoinsTOP();
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
}
