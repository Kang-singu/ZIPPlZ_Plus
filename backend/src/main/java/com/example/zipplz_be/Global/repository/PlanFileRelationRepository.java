package com.example.zipplz_be.Global.repository;

import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.Global.relation.PlanFileRelation;
import com.example.zipplz_be.Schedule.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlanFileRelationRepository extends JpaRepository<PlanFileRelation,Integer> {
    List<PlanFileRelation> findByPlanSerial(Plan plan);
    PlanFileRelation findByPlanSerialAndFileSerial(Plan plan, File file);
}
