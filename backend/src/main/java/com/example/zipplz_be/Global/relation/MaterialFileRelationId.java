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
public class MaterialFileRelationId implements Serializable {
    private int materialSerial;
    private int fileSerial;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MaterialFileRelationId that = (MaterialFileRelationId) o;
        return materialSerial == that.materialSerial && fileSerial == that.fileSerial;
    }

    @Override
    public int hashCode() { return Objects.hash(materialSerial, fileSerial); }
}
