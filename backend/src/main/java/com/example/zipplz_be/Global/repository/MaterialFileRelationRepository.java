package com.example.zipplz_be.Global.repository;

import com.example.zipplz_be.Material.entity.Material;
import com.example.zipplz_be.Global.relation.MaterialFileRelation;
import com.example.zipplz_be.Global.relation.MaterialFileRelationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialFileRelationRepository extends JpaRepository<MaterialFileRelation, MaterialFileRelationId> {
    MaterialFileRelation findFirstByMaterialSerial(Material material);
    boolean existsByMaterialSerial(Material material);
}
