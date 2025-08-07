package com.example.zipplz_be.Global.relation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BoardFileRelationId implements Serializable {
    private int boardSerial;
    private int fileSerial;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BoardFileRelationId that = (BoardFileRelationId) o;
        return boardSerial == that.boardSerial && fileSerial == that.fileSerial;
    }

    @Override
    public int hashCode() { return Objects.hash(boardSerial, fileSerial); }
}
