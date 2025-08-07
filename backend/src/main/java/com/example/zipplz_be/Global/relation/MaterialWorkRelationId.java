package com.example.zipplz_be.Global.relation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MaterialWorkRelationId {
    private int materialSerial;
    private int workSerial;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MaterialWorkRelationId that = (MaterialWorkRelationId) o;
        return materialSerial == that.materialSerial && workSerial == that.materialSerial;
    }

    @Override
    public int hashCode() { return Objects.hash(materialSerial, workSerial); }

}
