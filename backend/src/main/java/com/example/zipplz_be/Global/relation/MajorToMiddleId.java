package com.example.zipplz_be.Global.relation;

import java.util.Objects;

public class MajorToMiddleId {
    private int majorCode;
    private int middleCode;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MajorToMiddleId that = (MajorToMiddleId) o;
        return majorCode == that.majorCode && middleCode == that.middleCode;
    }

    @Override
    public int hashCode() {
        return Objects.hash(majorCode, middleCode);
    }
}