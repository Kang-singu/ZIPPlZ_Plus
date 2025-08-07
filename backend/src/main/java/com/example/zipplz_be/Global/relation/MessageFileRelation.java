package com.example.zipplz_be.Global.relation;

import com.example.zipplz_be.File.entity.File;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@IdClass(MessageFileRelationId.class)
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageFileRelation {
    @Id
    @Column(name = "message_id")
    private String messageId;
    @Id
    @ManyToOne
    @JoinColumn(name = "file")
    private File file;
}
