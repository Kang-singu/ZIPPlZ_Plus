package com.example.zipplz_be.Material.repository;

import com.example.zipplz_be.Material.dto.MaterialDTO;
import com.example.zipplz_be.Material.entity.Material;
import com.example.zipplz_be.Global.entity.MajorCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Integer> {
    @Query(value = "SELECT * " +
            "FROM Material", nativeQuery = true)
    List<MaterialDTO> getMaterialList();
    Material findByMaterialSerial(int materialSerial);
    List<Material> findAll();
    List<Material> findAllByMajorCategory(MajorCategory major);
}