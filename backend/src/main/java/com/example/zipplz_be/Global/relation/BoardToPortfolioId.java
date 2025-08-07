package com.example.zipplz_be.Global.relation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BoardToPortfolioId implements Serializable {
    private int boardSerial;
    private int portfolioSerial;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BoardToPortfolioId that = (BoardToPortfolioId) o;
        return boardSerial == that.boardSerial && portfolioSerial == that.portfolioSerial;
    }

    @Override
    public int hashCode() {
        return Objects.hash(boardSerial, portfolioSerial);
    }
}