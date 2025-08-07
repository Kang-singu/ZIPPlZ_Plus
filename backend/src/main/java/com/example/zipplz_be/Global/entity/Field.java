package com.example.zipplz_be.Global.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Field {
    @Id
    @Column(name = "field_code")
    private int fieldCode;
    @Column(name = "field_name")
    private String fieldName;
}
