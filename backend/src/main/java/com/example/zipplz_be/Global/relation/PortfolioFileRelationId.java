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
public class PortfolioFileRelationId implements Serializable {
    private int portfolioSerial;
    private int fileSerial;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PortfolioFileRelationId that = (PortfolioFileRelationId) o;
        return portfolioSerial == that.portfolioSerial && fileSerial == that.fileSerial;
    }

    @Override
    public int hashCode() { return Objects.hash(portfolioSerial, fileSerial); }
}
