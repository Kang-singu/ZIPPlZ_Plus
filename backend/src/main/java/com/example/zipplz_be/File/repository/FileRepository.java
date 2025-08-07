package com.example.zipplz_be.File.repository;

import com.example.zipplz_be.Board.dto.BoardFileDTO;
import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.Material.dto.MaterialFileDTO;
import com.example.zipplz_be.Portfolio.dto.PortfolioFileDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface FileRepository extends JpaRepository<File, Integer> {
    @Query(value="SELECT * " +
            "FROM ( SELECT * " +
            "FROM PortfolioFileRelation pfr " +
            "WHERE portfolio_serial = :portfolio_serial ) as pf " +
            "LEFT JOIN File f on f.file_serial = pf.file_serial", nativeQuery = true)
    List<PortfolioFileDTO> getImg(@Param("portfolio_serial") int portfolio_serial);

    @Query(value = "SELECT * " +
            "FROM ( SELECT * " +
            "FROM MaterialFileRelation mfr " +
            "WHERE material_serial = :material_serial ) mf " +
            "LEFT JOIN File f on f.file_serial = mf.file_serial", nativeQuery = true)
    List<MaterialFileDTO> getMaterialImg(@Param("material_serial") int material_serial);

    @Query(value = "SELECT * " +
            "FROM ( SELECT * " +
            "FROM BoardFileRelation bfr " +
            "WHERE board_serial = :boardSerial ) bf " +
            "LEFT JOIN File f on f.file_serial = bf.file_serial", nativeQuery = true)
    List<BoardFileDTO> getBoardImg(@Param("boardSerial") int boardSerial);

    File findByFileSerial(int fileSerial);
    File findBySaveFile(String saveFile);

    void deleteFileByFileSerial(int fileSerial);
    boolean existsByFileSerial(int fileSerial);

}
