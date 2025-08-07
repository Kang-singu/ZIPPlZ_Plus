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
public class SidoToGugunId implements Serializable {
    private int sidoCode;
    private int gugunCode;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SidoToGugunId that = (SidoToGugunId) o;
        return sidoCode == that.sidoCode && gugunCode == that.gugunCode;
    }

    @Override
    public int hashCode() { return Objects.hash(sidoCode, gugunCode); }
}
