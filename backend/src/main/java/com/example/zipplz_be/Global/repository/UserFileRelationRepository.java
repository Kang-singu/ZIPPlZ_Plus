package com.example.zipplz_be.Global.repository;

import com.example.zipplz_be.Global.relation.UserFileRelation;
import com.example.zipplz_be.Global.relation.UserFileRelationId;
import com.example.zipplz_be.User.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserFileRelationRepository extends JpaRepository<UserFileRelation, UserFileRelationId> {

    List<UserFileRelation> findAllByUserSerial(User user);

    boolean existsByUserSerial(User user);
}
