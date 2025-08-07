package com.example.zipplz_be.Board.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BoardUserAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="board_user_address_serial")
    private int boardUserAddressSerial;
    @ManyToOne
    @JoinColumn(name="board_serial")
    private Board boardSerial;
    @Column(name="user_address")
    private String userAddress;
    @Column(name="field_id")
    private String fieldId;
}
