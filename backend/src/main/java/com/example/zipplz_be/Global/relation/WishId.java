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
public class WishId implements Serializable {
    private int userSerial;
    private int wishType;
    private int wishSerial;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WishId that = (WishId) o;
        return userSerial == that.userSerial && wishType == that.wishType && wishSerial == that.wishSerial;
    }

    @Override
    public int hashCode() { return Objects.hash(userSerial, wishType, wishSerial); }
}
