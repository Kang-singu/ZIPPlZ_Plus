package com.example.zipplz_be.User.repository;

import com.example.zipplz_be.User.entity.User;
import com.example.zipplz_be.User.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Integer> {
    Boolean existsByUserSerial(User userSerial);
    Worker findByUserSerial(User userSerial);
    Worker findByWorkerSerial(int workerSerial);
}
