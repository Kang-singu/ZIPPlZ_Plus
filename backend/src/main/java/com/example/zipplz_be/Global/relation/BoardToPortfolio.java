package com.example.zipplz_be.Global.relation;

import com.example.zipplz_be.Board.entity.Board;
import com.example.zipplz_be.Portfolio.entity.Portfolio;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@IdClass(BoardToPortfolioId.class)
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardToPortfolio {
    @Id
    @ManyToOne
    @JoinColumn(name = "board_serial")
    private Board boardSerial;
    @Id
    @ManyToOne
    @JoinColumn(name = "portfolio_serial")
    private Portfolio portfolioSerial;
}