package com.example.zipplz_be.Global.relation;

import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.Portfolio.entity.Portfolio;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@IdClass(PortfolioFileRelationId.class)
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioFileRelation {
    @Id
    @ManyToOne
    @JoinColumn(name="portfolio_serial")
    private Portfolio portfolioSerial;
    @Id
    @ManyToOne
    @JoinColumn(name="file_serial")
    private File fileSerial;
}
