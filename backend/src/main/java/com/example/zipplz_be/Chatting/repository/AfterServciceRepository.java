package com.example.zipplz_be.Chatting.repository;

import com.example.zipplz_be.Chatting.entity.AfterService;
import com.example.zipplz_be.Schedule.entity.Work;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AfterServciceRepository extends JpaRepository<AfterService,Integer> {
    Page<AfterService> findByWorkSerial(Work work, Pageable pageable);

    AfterService findByAfterServiceSerial(int afterServiceSerial);
}
