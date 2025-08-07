package com.example.zipplz_be.Portfolio.repository;

import com.example.zipplz_be.Global.entity.Field;
import com.example.zipplz_be.Portfolio.dto.PortfolioJoinDTO;
import com.example.zipplz_be.Portfolio.entity.Portfolio;
import com.example.zipplz_be.User.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PortfolioRepository extends JpaRepository<Portfolio, Integer> {
    @Query(value = "SELECT p.portfolio_serial as portfolio_serial, p.worker as worker, u.user_name as user_name, u.user_serial as user_serial, YEAR(u.birth_date) as birth_date, p.temperature, p.career as career, p.field_id as field_id, f.field_name as field_name, w.certificated_badge as certificated_badge, File.save_file " +
            "FROM Portfolio p " +
            "LEFT JOIN Worker w on w.worker_serial = p.worker " +
            "LEFT JOIN User u on w.user_serial = u.user_serial " +
            "LEFT JOIN Field f on f.field_code = p.field_id " +
            "LEFT JOIN File on File.file_serial = u.file_serial", nativeQuery = true)
    List<PortfolioJoinDTO> getPortfolioJoins();

    @Query(value = "SELECT j.*, f.field_name " +
            "FROM ( SELECT p.portfolio_serial as portfolio_serial, p.worker as worker, u.user_name as user_name, u.user_serial as user_serial, YEAR(u.birth_date) as birth_date, p.temperature, p.career as career, p.field_id as field_id, w.certificated_badge as certificated_badge, File.save_file " +
            "FROM Portfolio p " +
            "LEFT JOIN Worker w on w.worker_serial = p.worker " +
            "LEFT JOIN User u on w.user_serial = u.user_serial " +
            "LEFT JOIN File on File.file_serial = u.file_serial " +
            "WHERE p.field_id = :fieldCode ) as j " +
            "LEFT JOIN Field f on f.field_code = j.field_id ", nativeQuery = true)
    List<PortfolioJoinDTO> getPortfolioJoinsByField(int fieldCode);

    @Query(value = "SELECT j.*, f.field_name " +
            "FROM ( SELECT p.portfolio_serial as portfolio_serial, p.worker as worker, u.user_name as user_name, u.user_serial as user_serial, YEAR(u.birth_date) as birth_date, p.temperature, p.career as career, p.field_id as field_id, w.certificated_badge as certificated_badge, File.save_file " +
            "FROM Portfolio p " +
            "LEFT JOIN Worker w on w.worker_serial = p.worker " +
            "LEFT JOIN User u on w.user_serial = u.user_serial " +
            "LEFT JOIN File on File.file_serial = u.file_serial " +
            "WHERE u.user_name LIKE %?1% ) as j " +
            "LEFT JOIN Field f on f.field_code = j.field_id", nativeQuery = true)
    List<PortfolioJoinDTO> getPortfolioJoinsByName(@Param("name") String name);


    @Query(value = "SELECT p.portfolio_serial as portfolio_serial, p.worker as worker, u.user_name as user_name, u.user_serial as user_serial, YEAR(u.birth_date) as birth_date, p.temperature, p.career as career, p.field_id as field_id, f.field_name as field_name, w.certificated_badge as certificated_badge, File.save_file " +
            "FROM Portfolio p " +
            "LEFT JOIN Worker w on w.worker_serial = p.worker " +
            "LEFT JOIN User u on w.user_serial = u.user_serial " +
            "LEFT JOIN Field f on f.field_code = p.field_id " +
            "LEFT JOIN File on File.file_serial = u.file_serial " +
            "ORDER BY p.temperature DESC " +
            "LIMIT 10", nativeQuery = true)
    List<PortfolioJoinDTO> getPortfolioJoinsTOP();

    @Query(value = "SELECT p.portfolio_serial as portfolio_serial, p.worker as worker, u.user_name as user_name, u.user_serial as user_serial, YEAR(u.birth_date) as birth_date, p.temperature, p.career as career, p.field_id as field_id, f.field_name as field_name, w.certificated_badge as certificated_badge, File.save_file " +
            "FROM ( SELECT * " +
            "FROM BoardToPortfolio " +
            "WHERE board_serial = :boardSerial ) as b " +
            "LEFT JOIN Portfolio p on p.portfolio_serial = b.portfolio_serial " +
            "LEFT JOIN Worker w on w.worker_serial = p.worker " +
            "LEFT JOIN User u on w.user_serial = u.user_serial " +
            "LEFT JOIN Field f on f.field_code = p.field_id " +
            "LEFT JOIN File on File.file_serial = u.file_serial", nativeQuery = true)
    List<PortfolioJoinDTO> getPortfolioTags(@Param("boardSerial") int boardSerial);

    Portfolio findByWorkerAndFieldId(Worker userSerial, Field fieldId);
    List<Portfolio> findByWorker(Worker userSerial);
    Portfolio findByPortfolioSerial(int portfolioSerial);
}
