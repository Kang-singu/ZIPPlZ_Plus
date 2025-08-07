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
public class PlanFileRelationId implements Serializable {
    private int planSerial;
    private int fileSerial;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PlanFileRelationId that = (PlanFileRelationId) o;
        return planSerial == that.planSerial && fileSerial == that.fileSerial;
    }

    @Override
    public int hashCode() { return Objects.hash(planSerial, fileSerial); }
}
