package com.example.zipplz_be.Global.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class MajorCategory {
    @Id
    @Column(name = "major_code")
    private int majorCode;
    @Column(name = "major_name")
    private String majorName;

    @Override
    public String toString() {
        return "MajorCategory{" +
                "majorCode=" + majorCode +
                ", majorName='" + majorName + '\'' +
                '}';
    }
}
