package com.example.zipplz_be.User.repository;

import com.example.zipplz_be.User.entity.Customer;
import com.example.zipplz_be.User.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Boolean existsByUserSerial(User userSerial);
    Customer findByCustomerSerial(int customerSerial);
    Customer findByUserSerial(User userSerial);
}
