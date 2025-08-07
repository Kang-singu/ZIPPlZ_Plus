package com.example.zipplz_be.Global.entity;

import com.example.zipplz_be.Global.relation.MajorToMiddleId;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(MajorToMiddleId.class)
public class MiddleCategory {
    @Id
    @Column(name = "major_code")
    private int majorCode;

    @Id
    @Column(name = "middle_code")
    private int middleCode;

    @Column(name = "middle_name")
    private String middleName;
}