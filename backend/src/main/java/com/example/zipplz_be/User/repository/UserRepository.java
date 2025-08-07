package com.example.zipplz_be.User.repository;

import com.example.zipplz_be.User.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Boolean existsByEmail(String email);
    Boolean existsByUserSerial(int userSerial);
    User findByUserSerial(int userSerial);
        // email을 받아 DB 테이블에서 유저를 조회하는 메소드
    User findByEmail(String email);
}
