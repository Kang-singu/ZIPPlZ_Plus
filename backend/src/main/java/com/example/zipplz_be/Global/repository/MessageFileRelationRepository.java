package com.example.zipplz_be.Global.repository;

import com.example.zipplz_be.Global.relation.MessageFileRelation;
import com.example.zipplz_be.Global.relation.MessageFileRelationId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageFileRelationRepository extends JpaRepository<MessageFileRelation, MessageFileRelationId> {
    MessageFileRelation findByMessageId(String messageId);
}
