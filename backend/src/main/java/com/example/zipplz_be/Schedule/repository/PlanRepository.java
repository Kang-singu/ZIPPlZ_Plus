package com.example.zipplz_be.Schedule.repository;

import com.example.zipplz_be.Schedule.entity.Plan;
import com.example.zipplz_be.User.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Integer> {
    List<Plan> findBycustomerSerial(Customer customerSerial);
    boolean existsByCustomerSerialAndIsActive(Customer customerSerial, int active);
    Plan findByPlanSerial(int planSerial);
    Plan findByCustomerSerialAndIsActive(Customer customer, int isActive);
}
