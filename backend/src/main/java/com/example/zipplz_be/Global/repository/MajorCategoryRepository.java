package com.example.zipplz_be.Global.repository;

import com.example.zipplz_be.Global.entity.MajorCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MajorCategoryRepository extends JpaRepository<MajorCategory, Integer> {
    MajorCategory findByMajorName(String major);
}
