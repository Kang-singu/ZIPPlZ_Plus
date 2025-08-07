package com.example.zipplz_be.Global.relation;

import com.example.zipplz_be.Board.entity.Board;
import com.example.zipplz_be.File.entity.File;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@IdClass(BoardFileRelationId.class)
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardFileRelation {
    @Id
    @ManyToOne
    @JoinColumn(name="board_serial")
    private Board boardSerial;
    @Id
    @ManyToOne
    @JoinColumn(name="file_serial")
    private File fileSerial;
}
