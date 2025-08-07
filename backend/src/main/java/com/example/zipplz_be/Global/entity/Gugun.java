package com.example.zipplz_be.Global.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Gugun {
    @Id
    @Column(name="sido_code")
    private int sidoCode;
    @Id
    @Column(name="gugun_code")
    private int gugunCode;
    @Column(name="gugun_name")
    private String gugunName;
    @ManyToOne
    @JoinColumn(name="sido_code")
    private Sido sido;
}
