package com.example.zipplz_be.Global.repository;

import com.example.zipplz_be.Global.dto.FieldDTO;
import com.example.zipplz_be.Global.entity.Field;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FieldRepository extends JpaRepository<Field, Integer> {
    @Query(value="SELECT * " +
            "FROM Field" , nativeQuery = true)
    List<FieldDTO> getFields();

    Field findByFieldName(String fieldName);
    Field findByFieldCode(int fieldCode);
}
