package com.example.zipplz_be.Global.repository;

import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.Global.relation.PortfolioFileRelation;
import com.example.zipplz_be.Portfolio.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioFileRelationRepository extends JpaRepository<PortfolioFileRelation,Integer> {

    PortfolioFileRelation findByPortfolioSerialAndFileSerial(Portfolio portfolioSerial, File fileSerial);
}
