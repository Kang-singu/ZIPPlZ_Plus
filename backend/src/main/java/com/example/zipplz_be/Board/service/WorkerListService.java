package com.example.zipplz_be.Board.service;

import com.example.zipplz_be.Portfolio.dto.PortfolioViewDTO;

import java.util.List;

public interface WorkerListService {
    List<PortfolioViewDTO> getWorkLists();
    List<PortfolioViewDTO> getWorkListByField(int fieldCode);
    List<PortfolioViewDTO> getWorkListByName(String name);
    List<PortfolioViewDTO> getWorkListTop();

}
