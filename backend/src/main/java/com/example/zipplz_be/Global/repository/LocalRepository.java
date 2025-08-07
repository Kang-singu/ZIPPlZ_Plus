package com.example.zipplz_be.Global.repository;

import com.example.zipplz_be.Global.dto.GugunDTO;
import com.example.zipplz_be.Global.dto.SidoDTO;
import com.example.zipplz_be.Global.entity.Local;
import com.example.zipplz_be.User.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LocalRepository extends JpaRepository<Local, Integer> {
    @Query(value="SELECT * " +
            "FROM Sido", nativeQuery = true)
    List<SidoDTO> getSidoList();

    @Query(value="SELECT * " +
            "FROM Gugun " +
            "WHERE sido_code = :sido_code", nativeQuery = true)
    List<GugunDTO> getGugunList(@Param("sido_code") int sido_code);

    @Query(value="SELECT local_name " +
            "FROM Local " +
            "WHERE Local.user_serial = :user_serial", nativeQuery = true)
    List<String> getLocalNames(@Param("user_serial") int user_serial);

    Local findFirstByUserSerial(User user);

    boolean existsByUserSerial(User user);

    void deleteByUserSerial(User user);

    List<Local> findAllByUserSerial(User user);
}
